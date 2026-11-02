import React from 'react';
import { Link } from 'react-router-dom';

/** Presenta el póster y los distintivos de cartelera y disponibilidad. */
const CardPoster = ({ movie, title, poster, inTheaters, providers, onOpen }) => (
    <Link className='poster-link' to={`/detail?movieID=${movie.id}`} aria-label={`Ver ${title}`} onClick={onOpen}>
        <img className='movie-poster' src={poster} alt={`Póster de ${title}`} loading='lazy' />
        {inTheaters && <span className='cinema-badge' aria-label='Actualmente en cines en Argentina'>En cines</span>}
        {providers.length > 0 && <div
            className='provider-overlay'
            role='img'
            aria-label={`Disponible para ver en ${providers.map((provider) => provider.provider_name).join(', ')}`}
        >
            <div className='provider-logos'>
                {providers.slice(0, 4).map((provider) => <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt=''
                    title={provider.provider_name}
                    loading='lazy'
                />)}
            </div>
            <small className='provider-credit'>JustWatch</small>
        </div>}
    </Link>
);

export default CardPoster;
