
import axios from "axios";
const API_KEY = process.env.REACT_APP_API_KEY

export const getInfoById = async (movieID) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}?${API_KEY}&language=es-ES&external_source=imdb_id`)
    const data = response.data
    return data
}