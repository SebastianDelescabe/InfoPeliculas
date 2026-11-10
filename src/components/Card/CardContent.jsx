import React from 'react';
import { Link } from 'react-router-dom';

/** Muestra título, fecha o sinopsis y las acciones propias de cada lista. */
const CardContent = ({ movie, title, overview, releaseDate, onMarkWatched, onUndoWatched, onOpen }) => (
    <div className='card-body'>
        <h2 className='card-title'>{title}</h2>
        {movie.upcoming ? <>
            <p className='upcoming-card-date'>Estreno · {releaseDate}</p>
            <p className='card-text upcoming-card-overview'>{overview.slice(0, 150)}{overview.length > 150 ? '…' : ''}</p>
        </> : <p className='card-text'>{`${overview.slice(0, 88)}${overview.length > 88 ? '…' : ''}`}</p>}
        {onMarkWatched && <button type='button' className='card-list-action' onClick={() => onMarkWatched(movie)}>Marcar como vista</button>}
        {onUndoWatched && <button type='button' className='card-list-action' onClick={() => onUndoWatched(movie)}>Desmarcar como vista</button>}
        <Link to={`/detail?movieID=${movie.id}`} className='btn' onClick={onOpen}>Ver detalles</Link>
    </div>
);

export default CardContent;
