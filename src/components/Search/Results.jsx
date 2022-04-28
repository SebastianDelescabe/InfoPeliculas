import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import swal from 'sweetalert'
import { Card } from '../index'

const Results = () => {

    // let query = new URLSearchParams(window.location.search);
    // let keyword = query.get('keyword');
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();  // ---->>>>> MEJOR FORMA DE TRAER QUERYS PORQUE LO ACTUALIZA "EN VIVO"
    const keyword = searchParams.get("keyword");

    const [moviesResults, setMoviesResults] = useState([]);

    useEffect(() => {
        const endPoint = `https://api.themoviedb.org/3/search/movie?api_key=c1144f1a8afd4fbb4c3dcab9e9d70d36&language=es-ES&query=${keyword}`;
        axios.get(endPoint)
            .then((response) => {
                const data = response.data.results;
                if (data.length === 0) {
                    swal("", "No se encontraron resultados", "warning");
                    setTimeout(() => {
                        navigate('/listado')
                    }, 1000);
                } else {
                    setMoviesResults(data);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }, [keyword]); //va a estar atento a cambios en KeyWord


    return (
        <>
            <h2>Resultados <em> {keyword}</em></h2>
            <div className='row'>
                {
                    moviesResults.map((movie) => (
                        <Card key={movie.id} movie={movie} />
                    ))
                }
            </div>
        </>
    )
}

export default Results