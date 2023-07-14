import axios from "axios";

export const getInfo = async () => {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie?api_key=c1144f1a8afd4fbb4c3dcab9e9d70d36&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate')
    const data = response.data.results.map((e) => {
        return {
            id: e.id,
            poster_path: e.poster_path,
            title: e.title,
            overview: e.overview,
            favorite: false
        }
    })
    return data
}