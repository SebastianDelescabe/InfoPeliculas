import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import MovieFacts from './MovieFacts';

const statusLabels = {
    Rumored: 'Rumoreada',
    Planned: 'Anunciada',
    'In Production': 'En producción',
    'Post Production': 'En posproducción',
    Released: 'Estrenada',
    Canceled: 'Cancelada'
};

/** Presenta el póster y los datos principales de la ficha. */
const MovieSummary = ({ movie, poster, releaseDate, inTheaters, onBack }) => (
    <section className='detail-layout'>
        <div className='detail-poster-wrap'>
            <img src={poster} className='detail-poster' alt={`Póster de ${movie.title}`} />
            {inTheaters && <span className='cinema-badge' aria-label='Actualmente en cines en Argentina'>En cines</span>}
        </div>
        <div className='detail-copy'>
            <h1>{movie.title}</h1>
            {movie.status && <span className='movie-status'>{statusLabels[movie.status] || movie.status}</span>}
            {movie.tagline && <p className='detail-tagline'>{movie.tagline}</p>}
            <h2>Sinopsis</h2>
            <p>{movie.overview || 'Todavía no hay una sinopsis disponible.'}</p>
            <div className='detail-meta'>
                <span>
                    <strong>Rating:</strong> {Number(movie.vote_average || 0).toFixed(1)} <AiFillStar />
                    <small>{new Intl.NumberFormat('es-AR').format(Number(movie.vote_count) || 0)} votos</small>
                </span>
                <span><strong>Estreno:</strong> {releaseDate}</span>
            </div>
            <h2>Géneros</h2>
            <ul className='ul-detail'>{movie.genres?.map((genre) => <li className='li-detail' key={genre.id}>{genre.name}</li>)}</ul>
            <MovieFacts movie={movie} />
            <button onClick={onBack} className='btn back-button'>Volver</button>
        </div>
    </section>
);

export default MovieSummary;
