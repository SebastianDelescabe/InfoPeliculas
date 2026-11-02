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
        const parsedFeed = savedFeed ? JSON.parse(savedFeed) : null;
        return parsedFeed?.feedVersion === 9 ? parsedFeed : null;
    } catch {
        return null;
    }
};

const Home = () => {
    const token = sessionStorage.getItem('token');
    const { favorites } = useContext(AppContext);
    const favoritesRef = useRef(favorites);
    const sentinelRef = useRef(null);
    const genreFilterRef = useRef(null);
    const loadingRef = useRef(false);
    const [savedFeed] = useState(readSavedFeed);
    const [movies, setMovies] = useState(savedFeed?.movies || []);
    const [page, setPage] = useState(savedFeed?.page || 1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(savedFeed?.hasMore ?? true);
    const [error, setError] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(savedFeed?.selectedProvider || '');
    const [selectedSort, setSelectedSort] = useState(savedFeed?.selectedSort || 'popularity.desc');
    const [releaseRange, setReleaseRange] = useState(savedFeed?.releaseRange || 'last_year');
    const [inTheatersOnly, setInTheatersOnly] = useState(savedFeed?.inTheatersOnly || false);
    const [selectedGenres, setSelectedGenres] = useState(() => {
        if (Array.isArray(savedFeed?.selectedGenres)) return savedFeed.selectedGenres;
        return savedFeed?.selectedGenre ? [String(savedFeed.selectedGenre)] : [];
    });
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

        getInfo(page, selectedProvider, selectedMonetizationType, selectedGenres, selectedSort, releaseRange, inTheatersOnly)
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
                notify('No se pudieron cargar las películas. Podés intentar de nuevo.', 'error');
            })
            .finally(() => {
                if (!active) return;
                loadingRef.current = false;
                setLoading(false);
            });

        return () => { active = false; };
    }, [inTheatersOnly, page, releaseRange, retryCount, selectedGenres, selectedMonetizationType, selectedProvider, selectedSort]);

    useEffect(() => {
        try {
            sessionStorage.setItem(HOME_FEED_STORAGE_KEY, JSON.stringify({
                feedVersion: 9,
                movies,
                page,
                hasMore,
                selectedProvider,
                selectedSort,
                releaseRange,
                inTheatersOnly,
                selectedGenres,
                monetizationType: selectedMonetizationType,
                scrollY: savedFeed?.scrollY || 0
            }));
        } catch {
            // Keep browsing if the session storage quota is unavailable.
        }
    }, [hasMore, inTheatersOnly, movies, page, releaseRange, savedFeed, selectedGenres, selectedMonetizationType, selectedProvider, selectedSort]);

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

    const resetResults = () => {
        setPage(1);
        setMovies([]);
        setHasMore(true);
        setError(false);
        window.scrollTo(0, 0);
    };

    const toggleGenre = (genreId) => {
        setSelectedGenres((current) => current.includes(String(genreId))
            ? current.filter((id) => id !== String(genreId))
            : [...current, String(genreId)]);
        resetResults();
    };

    const clearFilters = () => {
        setSelectedProvider('');
        setSelectedGenres([]);
        setSelectedSort('popularity.desc');
        setReleaseRange('last_year');
        setInTheatersOnly(false);
        if (genreFilterRef.current) genreFilterRef.current.open = false;
        resetResults();
    };

    if (!token) return <Navigate to='/' replace />;

    return (
        <>
            <div className='home-layout'>
                <aside className='home-filter-panel' aria-labelledby='home-filter-heading'>
                    <h2 id='home-filter-heading'>Filtros</h2>
                    <label className='provider-filter' htmlFor='release-range-filter'>
                        <span>Período</span>
                        <select id='release-range-filter' value={releaseRange} onChange={(event) => { setReleaseRange(event.target.value); resetResults(); }}>
                            <option value='last_year'>Último año</option>
                            <option value='all'>Todas las películas</option>
                        </select>
                    </label>
                    <label className='provider-filter' htmlFor='sort-filter'>
                        <span>Ordenar por</span>
                        <select id='sort-filter' value={selectedSort} onChange={(event) => { setSelectedSort(event.target.value); resetResults(); }}>
                            <option value='popularity.desc'>{releaseRange === 'all' ? 'Más conocidas' : 'Popularidad'}</option>
                            <option value='vote_average.desc'>Mejor puntuación ponderada</option>
                        </select>
                    </label>
                    <div className='provider-filter genre-multi-filter'>
                        <span>Géneros</span>
                        <details className='genre-filter' ref={genreFilterRef}>
                            <summary aria-label='Filtrar por géneros'>
                                {genresLoading ? 'Cargando géneros…' : selectedGenres.length ? `${selectedGenres.length} seleccionados` : 'Todos los géneros'}
                            </summary>
                            <div className='genre-filter-options'>
                                {genres.map((genre) => <label key={genre.id}>
                                    <input
                                        type='checkbox'
                                        checked={selectedGenres.includes(String(genre.id))}
                                        onChange={() => toggleGenre(genre.id)}
                                        disabled={genresLoading}
                                    />
                                    <span>{genre.name}</span>
                                </label>)}
                            </div>
                        </details>
                    </div>
                    <label className='home-cinema-checkbox'>
                        <input
                            type='checkbox'
                            checked={inTheatersOnly}
                            onChange={(event) => { setInTheatersOnly(event.target.checked); resetResults(); }}
                        />
                        <span>
                            <strong>En cartelera Argentina</strong>
                        </span>
                    </label>
                    <button
                        type='button'
                        className='clear-filters-button'
                        onClick={clearFilters}
                        disabled={!selectedProvider && selectedGenres.length === 0 && selectedSort === 'popularity.desc' && releaseRange === 'last_year' && !inTheatersOnly}
                    >
                        Limpiar filtros
                    </button>
                </aside>
                <div className='home-results'>
            <div className='section-toolbar'>
                <div>
                    <h1 className='page-heading'>{inTheatersOnly
                        ? <>Películas <span>en cines</span></>
                        : releaseRange === 'all' ? <>Todas las <span>películas</span></> : <>Últimos <span>estrenos</span></>}</h1>
                    <p className='section-subtitle'>{inTheatersOnly
                        ? 'Películas actualmente en cartelera en Argentina.'
                        : releaseRange === 'all'
                            ? 'Películas estrenadas en Argentina, ordenadas por popularidad o puntaje.'
                            : 'Estrenos en Argentina del último año, ordenados por popularidad o puntaje.'}</p>
                </div>
                <div className='home-filters'>
                    <label className='provider-filter' htmlFor='provider-filter'>
                        <span>Plataforma</span>
                        <select id='provider-filter' value={selectedProvider} onChange={(event) => { setSelectedProvider(event.target.value); resetResults(); }} disabled={providersLoading}>
                            <option value=''>{providersLoading ? 'Cargando plataformas…' : 'Todas las plataformas'}</option>
                            {providers.map((provider) => <option key={provider.provider_id} value={provider.provider_id}>{provider.provider_name}</option>)}
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
            {loading && <p className='loading-state'>Cargando más películas…</p>}
            {error && <button className='btn' onClick={() => setRetryCount((count) => count + 1)}>Reintentar</button>}
            {!loading && !error && movies.length === 0 && <p className='empty-state'>No hay películas para mostrar con estos filtros.</p>}
            {!hasMore && movies.length > 0 && <p className='empty-state'>Llegaste al final de las películas disponibles con estos filtros.</p>}
            <div ref={sentinelRef} className='scroll-sentinel' aria-hidden='true' />
                </div>
            </div>
        </>
    );
};

export default Home;
