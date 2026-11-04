import axios from "axios";

// La clave se configura en REACT_APP_API_KEY para no escribirla en el código fuente.
const API_KEY = process.env.REACT_APP_API_KEY

export const getInfo = async (page = 1) => {
    // Se pide a TMDB la página solicitada; cada página contiene otra tanda de películas.
    // TMDB devuelve release_date y popularity en cada resultado; se ordena primero por popularidad.
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
    // Se adapta cada resultado de TMDB al formato que usan las tarjetas de la aplicación.
    const data = response.data.results.map((e) => {
        return {
            id: e.id,
            poster_path: e.poster_path,
            title: e.title,
            overview: e.overview,
            release_date: e.release_date,
            popularity: e.popularity,
            favorite: false
        }
    })

    // También se devuelve la metadata para saber cuándo se alcanza la última página.
    return {
        movies: data,
        page: response.data.page,
        totalPages: response.data.total_pages,
    }
}
