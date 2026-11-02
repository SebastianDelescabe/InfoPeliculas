import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../helpers/AppContext';
import { notify } from '../../helpers/notify';

/** Sincroniza el favorito de una película en el feed, contexto y almacenamiento. */
const useMovieFavorite = (movie, moviesResults, setMoviesResults) => {
    const { setMovies, movies, favorites, setFavorites, watched } = useContext(AppContext);
    const [heartPop, setHeartPop] = useState(false);
    const animationTimer = useRef(null);
    const sourceMovies = moviesResults || movies;

    // Limpia la animación si la tarjeta se desmonta antes de que termine.
    useEffect(() => () => window.clearTimeout(animationTimer.current), []);

    const toggleFavorite = () => {
        const isFavorite = !movie.favorite;
        if (isFavorite && watched.some((item) => item.id === movie.id)) {
            notify('Esta película ya está marcada como vista.', 'info');
            return;
        }

        if (isFavorite) {
            setHeartPop(true);
            window.clearTimeout(animationTimer.current);
            animationTimer.current = window.setTimeout(() => setHeartPop(false), 520);
            notify(`${movie.title || movie.name || 'Película'} se agregó a Películas a mirar`, 'success');
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

    return { heartPop, toggleFavorite };
};

export default useMovieFavorite;
