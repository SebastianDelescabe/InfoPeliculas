import { tmdbGet } from './tmdb';

const getLocalDate = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

const getDateMonthsAhead = (months) => {
    const target = new Date();
    const day = target.getDate();
    target.setHours(0, 0, 0, 0);
    target.setDate(1);
    target.setMonth(target.getMonth() + months);
    const lastDayOfTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(day, lastDayOfTargetMonth));
    return new Date(target.getTime() - target.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

/** Trae películas con estreno previsto en cualquier región durante los próximos cuatro meses. */
export const upcoming = async () => {
    const today = getLocalDate();
    const endDate = getDateMonthsAhead(4);
    const params = {
        language: 'es-AR',
        include_adult: false,
        include_video: false,
        'primary_release_date.gte': today,
        'primary_release_date.lte': endDate,
        sort_by: 'popularity.desc',
        page: 1
    };
    const firstPage = await tmdbGet('/discover/movie', params);
    const pageCount = Math.min(firstPage.data.total_pages || 1, 10);
    const remainingPages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) =>
        tmdbGet('/discover/movie', { ...params, page: index + 2 })
    ));
    const movies = [
        ...(firstPage.data.results || []),
        ...remainingPages.flatMap((response) => response.data.results || [])
    ];
    const data = movies
        .filter((movie) => /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date || '') && movie.release_date >= today && movie.release_date <= endDate)
        .sort((first, second) => (second.popularity || 0) - (first.popularity || 0) || first.release_date.localeCompare(second.release_date))
        .map((movie) => ({
            id: movie.id,
            poster_path: movie.poster_path,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            popularity: movie.popularity || 0,
            favorite: false,
            upcoming: true
        }));
    return data;
}
