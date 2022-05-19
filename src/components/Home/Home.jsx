import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../helpers/AppContext';
import { Card } from '../index';

const Home = () => {
    //Si quiero salir de componente listado si no tengo nada en el sessionstorage
    let token = sessionStorage.getItem('token')

    const { movies } = useContext(AppContext)

    return (
        <>
            {!token && <Navigate to='/' />}
            <div className='row'>
                {movies && movies.map((movie) => (
                    <Card movie={movie} key={movie.id} />
                ))}
            </div>
        </>
    )
}

export default Home