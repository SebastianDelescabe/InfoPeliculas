import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

/** Botón de favorito con estado accesible y animación al guardar. */
const CardFavoriteButton = ({ movie, heartPop, onToggle }) => (
    <button
        type='button'
        onClick={onToggle}
        className={`fav-icon ${movie.favorite ? 'is-favorite' : ''} ${heartPop ? 'favorite-pop' : ''}`}
        aria-label={movie.favorite ? 'Quitar de Películas a mirar' : 'Agregar a Películas a mirar'}
        title={movie.favorite ? 'Quitar de Películas a mirar' : 'Agregar a Películas a mirar'}
    >
        {movie.favorite ? <AiFillHeart /> : <AiOutlineHeart />}
    </button>
);

export default CardFavoriteButton;
