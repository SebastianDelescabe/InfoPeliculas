import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../helpers/AppContext';
import { getInfo } from '../../helpers/getInfo';
import { notify } from '../../helpers/notify';
import { getCommonMovieGenres, getStreamingProviders } from '../../helpers/tmdb';
import { Card } from '../index';

const HOME_FEED_STORAGE_KEY = 'home-feed-state';

const readSavedFeed = () => {
    try {
        const savedFeed = sessionStorage.getItem(HOME_FEED_STORAGE_KEY);
        return savedFeed ? JSON.parse(savedFeed) : null;
    } catch {
        return null;
    }
};

const Home = () => {
    const token = sessionStorage.getItem('token');
    const { favorites } = useContext(AppContext);
    const favoritesRef = useRef(favorites);
    const sentinelRef = useRef(null);
    const loadingRef = useRef(false);
    const [savedFeed] = useState(readSavedFeed);
    const [movies, setMovies] = useState(savedFeed?.movies || []);
    const [page, setPage] = useState(savedFeed?.page || 1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(savedFeed?.hasMore ?? true);
    const [error, setError] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(savedFeed?.selectedProvider || '');
    const [selectedGenre, setSelectedGenre] = useState(savedFeed?.selectedGenre || '');
    const [providers, setProviders] = useState([]);
    const [genres, setGenres] = useState([]);
    const [providersLoading, setProvidersLoading] = useState(true);
    const [genresLoading, setGenresLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const skipInitialFetch = useRef(Boolean(savedFeed));

    favoritesRef.current = favorites;
    const selectedPlatform = providers.find((provider) => String(provider.provider_id) === selectedProvider);
    const selectedMonetizationType = selectedPlatform?.monetizationType || savedFeed?.monetizationType || 'flatrate';

    useLayoutEffect(() => {
        if (savedFeed?.scrollY) window.scrollTo(0, savedFeed.scrollY);
    }, [savedFeed]);

    useEffect(() => {
        getStreamingProviders()
            .then(setProviders)
            .catch(() => notify('No se pudieron cargar las plataformas de streaming.', 'error'))
            .finally(() => setProvidersLoading(false));
        getCommonMovieGenres()
            .then(setGenres)
            .catch(() => notify('No se pudieron cargar los géneros.', 'error'))
            .finally(() => setGenresLoading(false));
    }, []);

    useEffect(() => {
        if (skipInitialFetch.current) {
            skipInitialFetch.current = false;
            return undefined;
        }

        let active = true;
        loadingRef.current = true;
        setLoading(true);
        setError(false);

        getInfo(page, selectedProvider, selectedMonetizationType, selectedGenre)
            .then((response) => {
                if (!active) return;
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
                setHasMore(page < response.totalPages);
            })
            .catch(() => {
                if (!active) return;
                setError(true);
                notify('No se pudieron cargar los estrenos. Podés intentar de nuevo.', 'error');
            })
            .finally(() => {
                if (!active) return;
                loadingRef.current = false;
                setLoading(false);
            });

        return () => { active = false; };
    }, [page, retryCount, selectedGenre, selectedMonetizationType, selectedProvider]);

    useEffect(() => {
        try {
            sessionStorage.setItem(HOME_FEED_STORAGE_KEY, JSON.stringify({
                movies,
                page,
                hasMore,
                selectedProvider,
                selectedGenre,
                monetizationType: selectedMonetizationType,
                scrollY: savedFeed?.scrollY || 0
            }));
        } catch {
            // Keep browsing if the session storage quota is unavailable.
        }
    }, [hasMore, movies, page, savedFeed, selectedGenre, selectedProvider]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore || loading || error) return undefined;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || loadingRef.current) return;
            loadingRef.current = true;
            setPage((current) => current + 1);
        }, { rootMargin: '500px 0px' });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [error, hasMore, loading]);

    const handleFilterChange = (event, setFilter) => {
        setFilter(event.target.value);
        setPage(1);
        setMovies([]);
        setHasMore(true);
        setError(false);
    };

    if (!token) return <Navigate to='/' replace />;

    return (
        <>
            <div className='section-toolbar'>
                <div>
                    <h1 className='page-heading'>Últimos <span>estrenos</span></h1>
                    <p className='section-subtitle'>Estrenos en Argentina del último año, ordenados por popularidad.</p>
                </div>
                <div className='home-filters'>
                    <label className='provider-filter' htmlFor='provider-filter'>
                        <span>Plataforma</span>
                        <select id='provider-filter' value={selectedProvider} onChange={(event) => handleFilterChange(event, setSelectedProvider)} disabled={providersLoading}>
                            <option value=''>{providersLoading ? 'Cargando plataformas…' : 'Todas las plataformas'}</option>
                            {providers.map((provider) => <option key={provider.provider_id} value={provider.provider_id}>{provider.provider_name}</option>)}
                        </select>
                    </label>
                    <label className='provider-filter' htmlFor='genre-filter'>
                        <span>Género</span>
                        <select id='genre-filter' value={selectedGenre} onChange={(event) => handleFilterChange(event, setSelectedGenre)} disabled={genresLoading}>
                            <option value=''>{genresLoading ? 'Cargando géneros…' : 'Todos los géneros'}</option>
                            {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
                        </select>
                    </label>
                </div>
            </div>
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
            {error && <button className='btn' onClick={() => setRetryCount((count) => count + 1)}>Reintentar</button>}
            {!loading && !error && movies.length === 0 && <p className='empty-state'>No hay estrenos recientes para mostrar.</p>}
            {!hasMore && movies.length > 0 && <p className='empty-state'>Ya viste todos los estrenos recientes.</p>}
            <div ref={sentinelRef} className='scroll-sentinel' aria-hidden='true' />
        </>
    );
};

export default Home;
