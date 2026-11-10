import axios from 'axios';

const configuredKey = (process.env.REACT_APP_API_KEY || '').trim();
const apiKey = configuredKey.startsWith('api_key=')
    ? configuredKey.slice('api_key='.length)
    : configuredKey;

const client = axios.create({ baseURL: 'https://api.themoviedb.org/3' });
export const TMDB_REGION = 'AR';

// Centraliza las consultas para compartir clave, región y cliente HTTP.
export const tmdbGet = (path, params = {}) => client.get(path, {
    params: { api_key: apiKey, ...params }
});

const watchProviderCache = new Map();
const imaxReleaseCache = new Map();
let streamingProviderListRequest;
let movieGenreListRequest;
let nowPlayingMovieIdsRequest;
const nowPlayingPageCache = new Map();
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

/** Devuelve servicios de una película y reutiliza respuestas recientes. */
export const getWatchProviders = async (movieId) => {
    const cacheKey = String(movieId);
    if (watchProviderCache.has(cacheKey)) {
        const cachedRequest = watchProviderCache.get(cacheKey);
        watchProviderCache.delete(cacheKey);
        watchProviderCache.set(cacheKey, cachedRequest);
        return cachedRequest;
    }

    const request = tmdbGet(`/movie/${movieId}/watch/providers`)
        .then((response) => response.data.results?.[TMDB_REGION] || null);
    watchProviderCache.set(cacheKey, request);
    // Limita el caché para evitar acumular datos durante el scroll infinito.
    if (watchProviderCache.size > 500) watchProviderCache.delete(watchProviderCache.keys().next().value);

    try {
        const providers = await request;
        watchProviderCache.set(cacheKey, providers);
        return providers;
    } catch (error) {
        watchProviderCache.delete(cacheKey);
        throw error;
    }
};

/** Indica IMAX sólo si TMDB incluye esa mención en los datos de estreno. */
export const getImaxReleaseLabel = async (movieId) => {
    const cacheKey = String(movieId);
    if (imaxReleaseCache.has(cacheKey)) return imaxReleaseCache.get(cacheKey);

    const request = tmdbGet(`/movie/${movieId}/release_dates`).then((response) => {
        const countries = response.data.results || [];
        const hasImaxRelease = (country) => (country.release_dates || [])
            .some((release) => /\bimax\b/i.test(release.note || ''));
        if (countries.some((country) => country.iso_3166_1 === TMDB_REGION && hasImaxRelease(country))) return 'IMAX Argentina';
        return countries.some(hasImaxRelease) ? 'Disponible en IMAX' : '';
    });
    imaxReleaseCache.set(cacheKey, request);

    try {
        const label = await request;
        imaxReleaseCache.set(cacheKey, label);
        return label;
    } catch (error) {
        imaxReleaseCache.delete(cacheKey);
        throw error;
    }
};

/** Filtra y ordena las plataformas populares disponibles para Argentina. */
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

/** Devuelve géneros comunes con los nombres localizados de TMDB. */
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

/** Consulta y guarda temporalmente una página de películas en cartelera. */
export const getNowPlayingMoviesPage = async (page = 1) => {
    if (!nowPlayingPageCache.has(page)) {
        nowPlayingPageCache.set(page, tmdbGet('/movie/now_playing', {
            language: 'es-AR',
            region: TMDB_REGION,
            page
        }).then((response) => response.data).catch((error) => {
            nowPlayingPageCache.delete(page);
            throw error;
        }));
    }

    return nowPlayingPageCache.get(page);
};

/** Reúne IDs de cartelera para marcar tarjetas sin repetir consultas. */
export const getNowPlayingMovieIds = async () => {
    if (!nowPlayingMovieIdsRequest) {
        nowPlayingMovieIdsRequest = getNowPlayingMoviesPage(1)
            .then(async (firstPage) => {
                const lastPage = Math.min(firstPage.total_pages || 1, 10);
                const remainingPages = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) =>
                    getNowPlayingMoviesPage(index + 2)
                ));
                const movies = [
                    ...(firstPage.results || []),
                    ...remainingPages.flatMap((page) => page.results || [])
                ];
                return new Set(movies.map((movie) => movie.id));
            });
    }

    try {
        return await nowPlayingMovieIdsRequest;
    } catch (error) {
        nowPlayingMovieIdsRequest = undefined;
        throw error;
    }
};
