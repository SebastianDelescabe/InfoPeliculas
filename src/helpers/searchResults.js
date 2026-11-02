import { tmdbGet } from './tmdb';

export const searchResults = async (keyword) => {
    const response = await tmdbGet('/search/movie', { language: 'es-AR', query: keyword });
    const data = response.data.results.map((e) => {
        return {
            id: e.id,
            poster_path: e.poster_path,
            title: e.title,
            overview: e.overview,
            favorite: false,
        }
    })
    return data
}
