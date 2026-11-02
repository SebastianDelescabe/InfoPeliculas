import { TMDB_REGION, tmdbGet } from './tmdb';

const localDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
};

// Suaviza películas con pocas reseñas cuando se ordena por puntuación.
const weightedRating = (movie) => {
    const votes = Number(movie.vote_count) || 0;
    const rating = Number(movie.vote_average) || 0;
    const priorVotes = 500;
    return ((votes / (votes + priorVotes)) * rating) + ((priorVotes / (votes + priorVotes)) * 6.5);
};

/** Busca candidatas según el perfil y las respuestas del quiz. */
export const findQuizCandidates = async ({ genreIds, profile, period, providerId, monetizationType }) => {
    const today = new Date();
    const params = {
        language: 'es-AR',
        region: TMDB_REGION,
        sort_by: profile === 'known' ? 'vote_count.desc' : 'vote_average.desc',
        include_adult: false,
        include_video: false,
        page: 1
    };

    if (period === 'last_year') {
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        params['primary_release_date.gte'] = localDate(oneYearAgo);
    }
    params['primary_release_date.lte'] = localDate(today);

    // TMDB usa coma para exigir todos los géneros seleccionados (AND).
    if (genreIds.length) params.with_genres = genreIds.join(',');

    if (profile === 'known') {
        params['vote_count.gte'] = period === 'last_year' ? 300 : 1500;
    } else {
        params['vote_count.gte'] = 100;
        params['vote_count.lte'] = 1500;
        params['vote_average.gte'] = 6.5;
    }

    if (providerId) {
        params.watch_region = TMDB_REGION;
        params.with_watch_monetization_types = monetizationType;
        params.with_watch_providers = providerId;
    }

    const response = await tmdbGet('/discover/movie', params);
    const movies = (response.data.results || [])
        // Refuerza la combinación para que cada resultado tenga todos los géneros elegidos.
        .filter((movie) => genreIds.every((genreId) => (movie.genre_ids || []).includes(genreId)))
        .filter((movie) => movie.poster_path && movie.release_date && movie.release_date <= localDate(today))
        .filter((movie) => profile !== 'niche' || (movie.vote_count >= 100 && movie.vote_average >= 6.5))
        .sort((first, second) => profile === 'niche'
            ? weightedRating(second) - weightedRating(first)
            : Number(second.vote_count) - Number(first.vote_count))
        .map((movie) => ({
            id: movie.id,
            poster_path: movie.poster_path,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            favorite: false
        }));

    return movies;
};
