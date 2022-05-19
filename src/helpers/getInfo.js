import axios from "axios";

const API_ROUTE = process.env.REACT_APP_API_ROUTE

export const getInfo = async () => {
    const response = await axios.get(API_ROUTE)
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