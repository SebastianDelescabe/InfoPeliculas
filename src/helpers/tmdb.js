import axios from 'axios';

const configuredKey = (process.env.REACT_APP_API_KEY || '').trim();
const apiKey = configuredKey.startsWith('api_key=')
    ? configuredKey.slice('api_key='.length)
    : configuredKey;

const client = axios.create({ baseURL: 'https://api.themoviedb.org/3' });
export const TMDB_REGION = 'AR';

export const tmdbGet = (path, params = {}) => client.get(path, {
    params: { api_key: apiKey, ...params }
});

const watchProviderCache = new Map();
let streamingProviderListRequest;
let movieGenreListRequest;
const commonMovieGenreIds = [28, 12, 16, 35, 80, 18, 14, 9648, 10749, 878, 53, 27];
const popularProviderNames = new Set([
    'mubi', 'netflix', 'amazonprimevideo', 'primevideo', 'hbomax', 'hbo', 'max',
    'mercadoplay', 'flow', 'dgo', 'directvgo', 'disney', 'disneyplus',
    'paramountplus', 'paramount', 'appletv', 'appletvplus', 'crunchyroll', 'clarovideo',
    'movistarplay', 'movistartv', 'starplus', 'star'
]);

const normalizeProviderName = (name) => name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
const freeOrAdSupportedProviders = new Set(['mercadoplay']);

export const getWatchProviders = async (movieId) => {
    if (watchProviderCache.has(movieId)) return watchProviderCache.get(movieId);

    const request = tmdbGet(`/movie/${movieId}/watch/providers`)
        .then((response) => response.data.results?.[TMDB_REGION] || null);
    watchProviderCache.set(movieId, request);

    try {
        const providers = await request;
        watchProviderCache.set(movieId, providers);
        return providers;
    } catch (error) {
        watchProviderCache.delete(movieId);
        throw error;
    }
};

export const getStreamingProviders = async () => {
    if (!streamingProviderListRequest) {
        streamingProviderListRequest = tmdbGet('/watch/providers/movie', {
            language: 'es-AR',
            watch_region: TMDB_REGION
        })
            .then((response) => (response.data.results || [])
                .filter((provider) => popularProviderNames.has(normalizeProviderName(provider.provider_name)))
                .map((provider) => ({
                    ...provider,
                    monetizationType: freeOrAdSupportedProviders.has(normalizeProviderName(provider.provider_name))
                        ? 'free|ads'
                        : 'flatrate'
                }))
                .sort((first, second) => first.display_priority - second.display_priority));
    }

    try {
        return await streamingProviderListRequest;
    } catch (error) {
        streamingProviderListRequest = undefined;
        throw error;
    }
};

export const getCommonMovieGenres = async () => {
    if (!movieGenreListRequest) {
        movieGenreListRequest = tmdbGet('/genre/movie/list', { language: 'es-AR' })
            .then((response) => {
                const genresById = new Map((response.data.genres || []).map((genre) => [genre.id, genre]));
                return commonMovieGenreIds.map((id) => genresById.get(id)).filter(Boolean);
            });
    }

    try {
        return await movieGenreListRequest;
    } catch (error) {
        movieGenreListRequest = undefined;
        throw error;
    }
};
