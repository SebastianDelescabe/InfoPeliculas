import React, { useContext } from 'react';
import { AppContext } from '../../helpers/AppContext';
import Card from '../Card/Card.jsx';

const Favorites = () => {
    const { favorites, setFavorites, watched, setWatched } = useContext(AppContext);

    const markAsWatched = (movie) => {
        setFavorites((current) => current.filter((item) => item.id !== movie.id));
        localStorage.setItem('favorites', JSON.stringify(favorites.filter((item) => item.id !== movie.id)));
        setWatched((current) => current.some((item) => item.id === movie.id)
            ? current
            : [...current, { ...movie, favorite: false }]);
    };

    const undoWatched = (movie) => {
        setWatched((current) => current.filter((item) => item.id !== movie.id));
        setFavorites((current) => current.some((item) => item.id === movie.id)
            ? current
            : [...current, { ...movie, favorite: true }]);
        localStorage.setItem('favorites', JSON.stringify(
            favorites.some((item) => item.id === movie.id)
                ? favorites
                : [...favorites, { ...movie, favorite: true }]
        ));
    };

    return (
        <>
            <h1 className='page-heading'>Películas <span>a mirar</span></h1>
            {favorites.length === 0
                ? <p className='empty-state'>Todavía no guardaste películas para mirar.</p>
                : <div className='favorites row'>
                    {favorites.map((movie) => <Card movie={movie} key={movie.id} onMarkWatched={markAsWatched} />)}
                </div>}

            <section className='watched-section' aria-labelledby='watched-heading'>
                <div className='watched-heading-row'>
                    <div>
                        <h2 id='watched-heading' className='page-heading'>Películas <span>que ya vi</span></h2>
                        <p className='section-subtitle'>Películas que ya viste.</p>
                    </div>
                </div>
                {watched.length === 0
                    ? <p className='empty-state'>Las películas que marques como vistas aparecerán acá.</p>
                    : <div className='favorites row'>
                        {watched.map((movie) => <Card
                            movie={movie}
                            key={movie.id}
                            hideFavorite
                            onUndoWatched={undoWatched}
                        />)}
                    </div>}
            </section>
        </>
    );
};

export default Favorites;
