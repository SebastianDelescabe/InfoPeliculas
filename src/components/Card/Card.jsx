import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { AppContext } from '../../helpers/AppContext';
import { notify } from '../../helpers/notify';

const Card = ({ movie, moviesResults, setMoviesResults }) => {
    const { setMovies, movies, favorites, setFavorites } = useContext(AppContext);
    const [heartPop, setHeartPop] = useState(false);
    const sourceMovies = moviesResults || movies;

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

    return (
        <div className='col-3'>
            <article className='movie-card animate__animated animate__fadeIn'>
                <Link className='poster-link' to={`/detail?movieID=${movie.id}`} aria-label={`Ver ${title}`}>
                    <img className='movie-poster' src={poster} alt={`Póster de ${title}`} loading='lazy' />
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
                    <Link to={`/detail?movieID=${movie.id}`} className='btn'>Ver detalles</Link>
                </div>
            </article>
        </div>
    );
};

export default Card;
