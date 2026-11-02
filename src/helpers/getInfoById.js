
import { tmdbGet } from './tmdb';

export const getInfoById = async (movieID) => {
    const response = await tmdbGet(`/movie/${movieID}`, { language: 'es-AR' });
    const data = response.data
    return data
}
