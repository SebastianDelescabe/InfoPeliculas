import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../helpers/AppContext';
import { getInfo } from '../../helpers/getInfo';
import { notify } from '../../helpers/notify';
import { Card } from '../index';

const Home = () => {
    const token = sessionStorage.getItem('token');
    const { favorites } = useContext(AppContext);
    const favoritesRef = useRef(favorites);
    const sentinelRef = useRef(null);
    const nextPageRef = useRef(1);
    const loadingRef = useRef(false);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);

    favoritesRef.current = favorites;

    const loadNextPage = useCallback(async () => {
        if (loadingRef.current || !hasMore) return;
        loadingRef.current = true;
        setLoading(true);
        setError(false);

        const page = nextPageRef.current;
        try {
            const response = await getInfo(page);
            const favoriteIds = new Set(favoritesRef.current.map((movie) => movie.id));
            const nextMovies = response.movies.map((movie) => ({
                ...movie,
                favorite: favoriteIds.has(movie.id)
            }));

            setMovies((current) => {
                if (page === 1) return nextMovies;
                const existingIds = new Set(current.map((movie) => movie.id));
                return [...current, ...nextMovies.filter((movie) => !existingIds.has(movie.id))];
            });
            nextPageRef.current = page + 1;
            setHasMore(page < response.totalPages);
        } catch (fetchError) {
            setError(true);
            notify('No se pudieron cargar más estrenos. Podés intentar de nuevo.', 'error');
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [hasMore]);

    useEffect(() => {
        loadNextPage();
    }, [loadNextPage]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore || loading || error) return undefined;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) loadNextPage();
        }, { rootMargin: '500px 0px' });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [error, hasMore, loading, loadNextPage]);

    if (!token) return <Navigate to='/' replace />;

    return (
        <>
            <h1 className='page-heading'>Últimos <span>estrenos</span></h1>
            <p className='section-subtitle'>Estrenos en Argentina del último año, ordenados por popularidad.</p>
            <div className='movie-grid'>
                {movies.map((movie) => (
                    <Card
                        key={movie.id}
                        movie={movie}
                        moviesResults={movies}
                        setMoviesResults={setMovies}
                    />
                ))}
            </div>
            {loading && <p className='loading-state'>Cargando más estrenos…</p>}
            {error && <button className='btn' onClick={loadNextPage}>Reintentar</button>}
            {!loading && !error && movies.length === 0 && <p className='empty-state'>No hay estrenos recientes para mostrar.</p>}
            {!hasMore && movies.length > 0 && <p className='empty-state'>Ya viste todos los estrenos recientes.</p>}
            <div ref={sentinelRef} className='scroll-sentinel' aria-hidden='true' />
        </>
    );
};

export default Home;
