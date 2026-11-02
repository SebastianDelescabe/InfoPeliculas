import { tmdbGet } from './tmdb';

const getLocalDate = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export const upcoming = async () => {
    const response = await tmdbGet('/movie/upcoming', {
        language: 'es-AR',
        region: 'AR'
    });
    const today = getLocalDate();
    const data = response.data.results
        .filter((movie) => /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date || '') && movie.release_date >= today)
        .sort((first, second) => first.release_date.localeCompare(second.release_date))
        .map((movie) => ({
            id: movie.id,
            poster_path: movie.poster_path,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            favorite: false,
            upcoming: true
        }));
    return data;
}
