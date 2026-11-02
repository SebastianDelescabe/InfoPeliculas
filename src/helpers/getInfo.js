import { tmdbGet } from './tmdb';

const localDate = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
};

export const getInfo = async (page = 1) => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const response = await tmdbGet('/discover/movie', {
        language: 'es-AR',
        region: 'AR',
        sort_by: 'popularity.desc',
        'primary_release_date.gte': localDate(oneYearAgo),
        'primary_release_date.lte': localDate(today),
        include_adult: false,
        include_video: false,
        page
    });

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
