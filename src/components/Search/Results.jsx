import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';/* eslint-disable */
import swal from 'sweetalert'
import { searchResults } from '../../helpers/searchResults';
import { Card } from '../index'

const Results = () => {

    const navigate = useNavigate();

    // ---->>>>> MEJOR FORMA DE TRAER QUERYS PORQUE LO ACTUALIZA "EN VIVO"
    const [searchParams, setSearchParams] = useSearchParams(); /* eslint-disable */
    const keyword = searchParams.get("keyword");

    const [moviesResults, setMoviesResults] = useState([]);

    useEffect(() => {
        searchResults(keyword)
            .then((response) => {
                if (response.length === 0) {
                    swal("", "No se encontraron resultados", "warning");
                    setTimeout(() => {
                        navigate('/home')
                    }, 1000);
                } else {
                    setMoviesResults(response);
                    localStorage.setItem('results', JSON.stringify(response))
                }
            })
            .catch(error => {
                console.log(error);
            })

    }, [keyword]); //va a estar atento a cambios en KeyWord

    return (
        <div className='search'>
            <h2>Resultados <em> {keyword}</em></h2>
            <div className='row'>
                {
                    moviesResults.map((movie) => (
                        <Card
                            key={movie.id}
                            movie={movie}
                            moviesResults={moviesResults}
                            setMoviesResults={setMoviesResults}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Results