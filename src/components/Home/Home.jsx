import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import swAlert from 'sweetalert'
import { Card } from '../index'

const Home = () => {
    //Si quiero salir de componente listado si no tengo nada en el sessionstorage
    const [moviesList, setMoviesList] = useState([]);


    let token = sessionStorage.getItem('token')

    useEffect(() => {
        const endPoint = 'https://api.themoviedb.org/3/discover/movie?api_key=c1144f1a8afd4fbb4c3dcab9e9d70d36&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate';
        axios.get(endPoint)
            .then((response) => {
                const apiData = response.data.results
                setMoviesList(apiData)
            })
            .catch(err => {
                swAlert(<h2>No se pudo cargar la informacion</h2>)
            })
    }, [setMoviesList])


    return (
        <>
            {!token && <Navigate to='/' />}
            <div className='row'>
                {moviesList && moviesList.map((movie) => (
                    <Card movie={movie} key={movie.id} />
                ))}
            </div>
        </>
    )
}

export default Home