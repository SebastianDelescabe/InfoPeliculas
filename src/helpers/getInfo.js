import { getNowPlayingMoviesPage, getWatchProviders, TMDB_REGION, tmdbGet } from './tmdb';

const localDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
};

export const getInfo = async (page = 1, providerId = '', monetizationType = 'flatrate', genreIds = [], sortBy = 'popularity.desc') => {
    const today = new Date();

    if (sortBy === 'now_playing') {
        const response = await getNowPlayingMoviesPage(page);
        let movies = response.results || [];

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
            movies: movies.map((movie) => ({
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

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const params = {
        language: 'es-AR',
        region: TMDB_REGION,
        sort_by: sortBy,
        'primary_release_date.gte': localDate(oneYearAgo),
        'primary_release_date.lte': localDate(today),
        include_adult: false,
        include_video: false,
        page
    };

    if (sortBy === 'vote_average.desc') {
        params['vote_count.gte'] = 2000;
        params['vote_average.gte'] = 6.5;
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
