import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY

export const searchResults = async (keyword) => {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?${API_KEY}&language=es-ES&query=${keyword}`);
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