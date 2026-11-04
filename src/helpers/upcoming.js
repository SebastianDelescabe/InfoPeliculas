import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY

export const upcoming = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const firstFutureDate = [
        tomorrow.getFullYear(),
        String(tomorrow.getMonth() + 1).padStart(2, '0'),
        String(tomorrow.getDate()).padStart(2, '0'),
    ].join('-');

    const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=es-ES&sort_by=popularity.desc&primary_release_date.gte=${firstFutureDate}&include_adult=false&include_video=false`
    );
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
