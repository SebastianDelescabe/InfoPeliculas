import React, { useContext } from 'react';
import { AppContext } from '../../helpers/AppContext';
import Card from '../Card/Card.jsx';

const Favorites = () => {

    const { favorites } = useContext(AppContext)

    localStorage.setItem('favorites', JSON.stringify(favorites))
    if (favorites.length === 0) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: 'calc(100vh - 82px)' }}>
                <h2>No tienes películas favoritas</h2>
            </div>
        );
    }
    return (
        <div className=' favorites row'>
            {favorites && favorites.map((movie) => (
                <Card movie={movie} key={movie.id} />
            ))}
        </div>
    )
}

export default Favorites