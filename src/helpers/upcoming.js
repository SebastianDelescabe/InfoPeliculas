import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY

export const upcoming = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?${API_KEY}`);
    console.log(response);
    const data = response.data.results.map((e) => {
        return {
            id: e.id,
            poster_path: e.poster_path,
            title: e.title,
            overview: e.overview,
            release_date: e.release_date,
            favorite: false,
            upcoming: true,
        }
    })
    return data
}