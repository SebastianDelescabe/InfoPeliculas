import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppContext } from '../../helpers/AppContext';
import { getInfo } from '../../helpers/getInfo';
import { notify } from '../../helpers/notify';
import { getCommonMovieGenres, getStreamingProviders } from '../../helpers/tmdb';

const HOME_FEED_STORAGE_KEY = 'home-feed-state';
const HOME_FEED_VERSION = 9;

// Lee el feed guardado para volver a la lista y filtros de la sesión anterior.
const readSavedFeed = () => {
    try {
        const savedFeed = sessionStorage.getItem(HOME_FEED_STORAGE_KEY);
        const parsedFeed = savedFeed ? JSON.parse(savedFeed) : null;
        return parsedFeed?.feedVersion === HOME_FEED_VERSION ? parsedFeed : null;
    } catch {
        return null;
    }
};

/** Maneja filtros, carga paginada, caché de sesión y acciones del feed principal. */
const useHomeFeed = () => {
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

    // Recupera el desplazamiento al volver desde la ficha de una película.
    useLayoutEffect(() => {
        if (savedFeed?.scrollY) window.scrollTo(0, savedFeed.scrollY);
    }, [savedFeed]);

    // Carga las listas pequeñas que alimentan los filtros de plataforma y género.
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

    // Consulta una página y descarta respuestas viejas si cambian los filtros.
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
                const nextMovies = response.movies.map((movie) => ({ ...movie, favorite: favoriteIds.has(movie.id) }));
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

    // Persiste filtros y películas para retomar la navegación en esta pestaña.
    useEffect(() => {
        try {
            sessionStorage.setItem(HOME_FEED_STORAGE_KEY, JSON.stringify({
                feedVersion: HOME_FEED_VERSION,
                movies,
                page,
                hasMore,
                selectedProvider,
                selectedSort,
                releaseRange,
                inTheatersOnly,
                selectedGenres,
                monetizationType: selectedMonetizationType,
                scrollY: window.scrollY
            }));
        } catch {
            // La navegación sigue disponible aunque el almacenamiento esté lleno.
        }
    }, [hasMore, inTheatersOnly, movies, page, releaseRange, selectedGenres, selectedMonetizationType, selectedProvider, selectedSort]);

    // Pide más resultados cuando el usuario se acerca al final de la lista.
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

    // Reinicia el feed y vuelve al inicio para que el cambio de filtro sea visible.
    const resetResults = useCallback(() => {
        setPage(1);
        setMovies([]);
        setHasMore(true);
        setError(false);
        window.scrollTo(0, 0);
    }, []);

    const changeFilter = useCallback((setter, value) => {
        setter(value);
        resetResults();
    }, [resetResults]);

    const toggleGenre = useCallback((genreId) => {
        setSelectedGenres((current) => current.includes(String(genreId))
            ? current.filter((id) => id !== String(genreId))
            : [...current, String(genreId)]);
        resetResults();
    }, [resetResults]);

    const clearFilters = useCallback(() => {
        setSelectedProvider('');
        setSelectedGenres([]);
        setSelectedSort('popularity.desc');
        setReleaseRange('last_year');
        setInTheatersOnly(false);
        if (genreFilterRef.current) genreFilterRef.current.open = false;
        resetResults();
    }, [resetResults]);

    const retry = useCallback(() => setRetryCount((count) => count + 1), []);
    const updateProvider = useCallback((value) => changeFilter(setSelectedProvider, value), [changeFilter]);
    const updateSort = useCallback((value) => changeFilter(setSelectedSort, value), [changeFilter]);
    const updateReleaseRange = useCallback((value) => changeFilter(setReleaseRange, value), [changeFilter]);
    const updateTheaterFilter = useCallback((value) => changeFilter(setInTheatersOnly, value), [changeFilter]);

    return {
        movies, setMovies, loading, hasMore, error, retry,
        selectedProvider, setSelectedProvider: updateProvider,
        selectedSort, setSelectedSort: updateSort,
        releaseRange, setReleaseRange: updateReleaseRange,
        inTheatersOnly, setInTheatersOnly: updateTheaterFilter,
        selectedGenres, genres, genresLoading, genreFilterRef, toggleGenre,
        providers, providersLoading, clearFilters, sentinelRef
    };
};

export default useHomeFeed;
