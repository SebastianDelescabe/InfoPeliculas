import { getNowPlayingMoviesPage, getWatchProviders, TMDB_REGION, tmdbGet } from './tmdb';

// Convierte una fecha local a AAAA-MM-DD sin desplazar el día por zona horaria.
const localDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
};

// Equilibra nota y cantidad de votos para reducir el efecto de muestras pequeñas.
const weightedRating = (movie) => {
    const votes = Number(movie.vote_count) || 0;
    const rating = Number(movie.vote_average) || 0;
    const priorRating = 6.5;
    const priorVotes = 500;
    return ((votes / (votes + priorVotes)) * rating)
        + ((priorVotes / (votes + priorVotes)) * priorRating);
};

/** Busca páginas de películas aplicando período, cartelera y filtros elegidos. */
export const getInfo = async (
    page = 1,
    providerId = '',
    monetizationType = 'flatrate',
    genreIds = [],
    sortBy = 'popularity.desc',
    releaseRange = 'last_year',
    inTheatersOnly = false
) => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // La cartelera usa el endpoint dedicado y aplica los filtros localmente.
    if (inTheatersOnly) {
        const response = await getNowPlayingMoviesPage(page);
        let movies = response.results || [];

        if (releaseRange === 'last_year') {
            const minDate = localDate(oneYearAgo);
            const maxDate = localDate(today);
            movies = movies.filter((movie) => movie.release_date && movie.release_date >= minDate && movie.release_date <= maxDate);
        }

        if (genreIds.length) {
            const selectedGenreIds = genreIds.map(Number);
            movies = movies.filter((movie) => selectedGenreIds.every((id) => movie.genre_ids?.includes(id)));
        }

        if (providerId) {
            const providerIds = movies.map(async (movie) => {
                const availability = await getWatchProviders(movie.id);
                const availableTypes = monetizationType.split('|');
                const isAvailable = availableTypes.some((type) =>
                    availability?.[type]?.some((provider) => String(provider.provider_id) === String(providerId))
                );
                return isAvailable ? movie.id : null;
            });
            const availableMovieIds = new Set((await Promise.all(providerIds)).filter(Boolean));
            movies = movies.filter((movie) => availableMovieIds.has(movie.id));
        }

        return {
            movies: movies
                .sort((first, second) => sortBy === 'vote_average.desc'
                    ? weightedRating(second) - weightedRating(first)
                    : 0)
                .map((movie) => ({
                    id: movie.id,
                    poster_path: movie.poster_path,
                    title: movie.title,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    favorite: false
                })),
            totalPages: response.total_pages || 1
        };
    }

    // En el catálogo completo, los votos representan mejor la popularidad histórica.
    const params = {
        language: 'es-AR',
        region: TMDB_REGION,
        sort_by: sortBy === 'vote_average.desc'
            ? 'vote_count.desc'
            : releaseRange === 'all' && sortBy === 'popularity.desc'
                ? 'vote_count.desc'
                : sortBy,
        'primary_release_date.lte': localDate(today),
        include_adult: false,
        include_video: false,
        page
    };

    if (releaseRange === 'last_year') {
        params['primary_release_date.gte'] = localDate(oneYearAgo);
    }

    if (providerId) {
        params.watch_region = TMDB_REGION;
        params.with_watch_monetization_types = monetizationType;
        params.with_watch_providers = providerId;
    }
    if (genreIds.length) params.with_genres = genreIds.join(',');

    const response = await tmdbGet('/discover/movie', params);

    return {
        movies: response.data.results
            .filter((movie) => movie.release_date && movie.release_date <= localDate(today))
            .sort((first, second) => sortBy === 'vote_average.desc'
                ? weightedRating(second) - weightedRating(first)
                : 0)
            .map((movie) => ({
                id: movie.id,
                poster_path: movie.poster_path,
                title: movie.title,
                overview: movie.overview,
                release_date: movie.release_date,
                favorite: false
            })),
        totalPages: response.data.total_pages
    };
};
