import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { AppContext } from '../../helpers/AppContext';
import { notify } from '../../helpers/notify';
import { getWatchProviders } from '../../helpers/tmdb';

const Card = ({ movie, moviesResults, setMoviesResults }) => {
    const { setMovies, movies, favorites, setFavorites } = useContext(AppContext);
    const [heartPop, setHeartPop] = useState(false);
    const [watchProviders, setWatchProviders] = useState(undefined);
    const cardRef = useRef(null);
    const sourceMovies = moviesResults || movies;

    const rememberHomePosition = () => {
        if (window.location.pathname !== '/home') return;
        try {
            const savedFeed = JSON.parse(sessionStorage.getItem('home-feed-state') || '{}');
            sessionStorage.setItem('home-feed-state', JSON.stringify({ ...savedFeed, scrollY: window.scrollY }));
        } catch {
            // Navigation should still work if session storage is unavailable.
        }
    };

    useEffect(() => {
        const card = cardRef.current;
        if (!card || movie.upcoming) return undefined;

        const loadProviders = () => getWatchProviders(movie.id)
            .then(setWatchProviders)
            .catch(() => setWatchProviders(null));

        if (!('IntersectionObserver' in window)) {
            loadProviders();
            return undefined;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            loadProviders();
        }, { rootMargin: '250px 0px' });

        observer.observe(card);
        return () => observer.disconnect();
    }, [movie.id, movie.upcoming]);

    const updateFavorite = (isFavorite) => {
        if (isFavorite) {
            setHeartPop(true);
            window.setTimeout(() => setHeartPop(false), 520);
            notify(`${movie.title || movie.name || 'Película'} se agregó a favoritos`, 'success');
        }
        const updatedMovie = { ...movie, favorite: isFavorite };
        const updatedSource = sourceMovies.map((item) => item.id === movie.id ? updatedMovie : item);
        if (moviesResults) {
            setMoviesResults(updatedSource);
            localStorage.setItem('results', JSON.stringify(updatedSource));
        } else {
            setMovies(updatedSource);
            localStorage.setItem('movies', JSON.stringify(updatedSource));
        }
        setFavorites((current) => isFavorite
            ? current.some((item) => item.id === movie.id) ? current : [...current, updatedMovie]
            : current.filter((item) => item.id !== movie.id));
        const nextFavorites = isFavorite
            ? favorites.some((item) => item.id === movie.id) ? favorites : [...favorites, updatedMovie]
            : favorites.filter((item) => item.id !== movie.id);
        localStorage.setItem('favorites', JSON.stringify(nextFavorites));
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
                <Link className='poster-link' to={`/detail?movieID=${movie.id}`} aria-label={`Ver ${title}`} onClick={rememberHomePosition}>
                    <img className='movie-poster' src={poster} alt={`Póster de ${title}`} loading='lazy' />
                    {availabilityProviders.length > 0 && <div
                        className='provider-overlay'
                        role='img'
                        aria-label={`Disponible para ver en ${availabilityProviders.map((provider) => provider.provider_name).join(', ')}`}
                    >
                        <div className='provider-logos'>
                            {availabilityProviders.slice(0, 4).map((provider) => <img
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
                {!movie.upcoming && <button
                    onClick={() => updateFavorite(!movie.favorite)}
                    className={`fav-icon ${movie.favorite ? 'is-favorite' : ''} ${heartPop ? 'favorite-pop' : ''}`}
                    aria-label={movie.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    title={movie.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                    {movie.favorite ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>}
                <div className='card-body'>
                    <h2 className='card-title'>{title}</h2>
                    <p className={`card-text ${movie.upcoming ? 'movie-date' : ''}`}>
                        {movie.upcoming ? releaseDate : `${overview.slice(0, 88)}${overview.length > 88 ? '…' : ''}`}
                    </p>
                    <Link to={`/detail?movieID=${movie.id}`} className='btn' onClick={rememberHomePosition}>Ver detalles</Link>
                </div>
            </article>
        </div>
    );
};

export default Card;
