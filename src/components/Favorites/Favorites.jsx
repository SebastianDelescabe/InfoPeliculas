import React, { useContext } from 'react';
import { AppContext } from '../../helpers/AppContext';
import Card from '../Card/Card.jsx';

const Favorites = () => {

    const { favorites } = useContext(AppContext)

    localStorage.setItem('favorites', JSON.stringify(favorites))

    return (
        <>
            <h1 className='page-heading'>Mis <span>favoritos</span></h1>
            {favorites.length === 0 && <p className='empty-state'>Todavía no agregaste películas a favoritos.</p>}
            <div className='favorites row'>
            {favorites && favorites.map((movie) => (
                <Card movie={movie} key={movie.id} />
            ))}
            </div>
        </>
    )
}

export default Favorites
