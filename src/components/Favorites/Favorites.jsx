import React, { useContext } from 'react';
import { AppContext } from '../../helpers/AppContext';
import Card from '../Card/Card.jsx';

const Favorites = () => {

    const { favorites } = useContext(AppContext)

    localStorage.setItem('favorites', JSON.stringify(favorites))

    return (
        <div className=' favorites row'>
            {favorites && favorites.map((movie) => (
                <Card movie={movie} key={movie.id} />
            ))}
        </div>
    )
}

export default Favorites