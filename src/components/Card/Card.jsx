import React, { useRef } from 'react';
import CardContent from './CardContent';
import CardFavoriteButton from './CardFavoriteButton';
import CardPoster from './CardPoster';
import useCardMetadata from './useCardMetadata';
import useMovieFavorite from './useMovieFavorite';

/** Compone una tarjeta y delega sus datos y acciones en hooks pequeños. */
const Card = ({ movie, moviesResults, setMoviesResults, onMarkWatched, onUndoWatched, hideFavorite = false }) => {
    const cardRef = useRef(null);
    const { watchProviders, inTheaters } = useCardMetadata(movie, cardRef);
    const { heartPop, toggleFavorite } = useMovieFavorite(movie, moviesResults, setMoviesResults);

    // Conserva la posición del listado cuando se abre una ficha desde Destacado.
    const rememberHomePosition = () => {
        if (window.location.pathname !== '/home') return;
        try {
            const savedFeed = JSON.parse(sessionStorage.getItem('home-feed-state') || '{}');
            sessionStorage.setItem('home-feed-state', JSON.stringify({ ...savedFeed, scrollY: window.scrollY }));
        } catch {
            // La navegación sigue funcionando si no se puede usar el almacenamiento.
        }
    };

    const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        : 'https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png';
    const title = movie.title || movie.name || 'Sin título';
    const overview = movie.overview || 'Todavía no hay una sinopsis disponible.';
    const releaseDate = movie.release_date && /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date)
        ? movie.release_date.split('-').reverse().join('-')
        : movie.release_date || 'Fecha sin confirmar';
    const availabilityProviders = [
        ...(watchProviders?.flatrate || []),
        ...(watchProviders?.free || []),
        ...(watchProviders?.ads || [])
    ].filter((provider, index, providers) => providers.findIndex((item) => item.provider_id === provider.provider_id) === index);

    return (
        <div className='col-3'>
            <article className='movie-card animate__animated animate__fadeIn' ref={cardRef}>
                <CardPoster
                    movie={movie}
                    title={title}
                    poster={poster}
                    inTheaters={inTheaters}
                    providers={availabilityProviders}
                    onOpen={rememberHomePosition}
                />
                {!movie.upcoming && !hideFavorite && <CardFavoriteButton
                    movie={movie}
                    heartPop={heartPop}
                    onToggle={toggleFavorite}
                />}
                <CardContent
                    movie={movie}
                    title={title}
                    overview={overview}
                    releaseDate={releaseDate}
                    onMarkWatched={onMarkWatched}
                    onUndoWatched={onUndoWatched}
                    onOpen={rememberHomePosition}
                />
            </article>
        </div>
    );
};

export default Card;
