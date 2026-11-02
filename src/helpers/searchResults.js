import { tmdbGet } from './tmdb';

/** Busca películas por texto y conserva solo los campos que usa la interfaz. */
export const searchResults = async (keyword) => {
    const response = await tmdbGet('/search/movie', { language: 'es-AR', query: keyword });
    return response.data.results.map((movie) => ({
        id: movie.id,
        poster_path: movie.poster_path,
        title: movie.title,
        overview: movie.overview,
        favorite: false
    }));
};
