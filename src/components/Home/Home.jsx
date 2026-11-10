import React, { useEffect, useRef, useState } from 'react';
import { FiSliders, FiX } from 'react-icons/fi';
import { Navigate, useSearchParams } from 'react-router-dom';
import HomeFilters from './HomeFilters';
import HomeResults from './HomeResults';
import useHomeFeed from './useHomeFeed';

/** Une el panel de filtros con el feed de películas destacadas. */
const Home = () => {
    const token = sessionStorage.getItem('token');
    const [searchParams, setSearchParams] = useSearchParams();
    const feed = useHomeFeed();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
    const [platformDocked, setPlatformDocked] = useState(false);
    const platformAnchorRef = useRef(null);
    const { inTheatersOnly, setInTheatersOnly } = feed;

    useEffect(() => {
        const media = window.matchMedia('(max-width: 760px)');
        const update = () => {
            setIsMobile(media.matches);
            if (!media.matches) setFiltersOpen(false);
        };
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setPlatformDocked(false);
            return undefined;
        }
        const updateDockedState = () => {
            const anchor = platformAnchorRef.current;
            setPlatformDocked(Boolean(anchor && anchor.getBoundingClientRect().top < 100));
        };
        updateDockedState();
        window.addEventListener('scroll', updateDockedState, { passive: true });
        window.addEventListener('resize', updateDockedState);
        return () => {
            window.removeEventListener('scroll', updateDockedState);
            window.removeEventListener('resize', updateDockedState);
        };
    }, [isMobile]);

    useEffect(() => {
        if (!filtersOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const closeOnEscape = (event) => { if (event.key === 'Escape') setFiltersOpen(false); };
        window.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [filtersOpen]);

    useEffect(() => {
        if (inTheatersOnly) setFiltersOpen(false);
    }, [inTheatersOnly]);

    // El nav controla el modo de cartelera sin duplicar ese control en el panel.
    useEffect(() => {
        const shouldShowTheaters = searchParams.get('scope') === 'theaters';
        if (inTheatersOnly !== shouldShowTheaters) setInTheatersOnly(shouldShowTheaters);
    }, [inTheatersOnly, searchParams, setInTheatersOnly]);

    const clearFilters = () => {
        feed.clearFilters();
        if (searchParams.has('scope')) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('scope');
            setSearchParams(nextParams, { replace: true });
        }
    };

    if (!token) return <Navigate to='/' replace />;

    const homeFilters = <HomeFilters
        releaseRange={feed.releaseRange}
        setReleaseRange={feed.setReleaseRange}
        selectedSort={feed.selectedSort}
        setSelectedSort={feed.setSelectedSort}
        genres={feed.genres}
        genresLoading={feed.genresLoading}
        selectedGenres={feed.selectedGenres}
        genreFilterRef={feed.genreFilterRef}
        toggleGenre={feed.toggleGenre}
        inTheatersOnly={feed.inTheatersOnly}
        selectedProvider={feed.selectedProvider}
        setSelectedProvider={feed.setSelectedProvider}
        providers={feed.providers}
        providersLoading={feed.providersLoading}
        showPlatform={!isMobile && platformDocked}
        clearFilters={clearFilters}
    />;
    const cinemaGenreFilter = <HomeFilters
        genres={feed.genres}
        genresLoading={feed.genresLoading}
        selectedGenres={feed.selectedGenres}
        toggleGenre={feed.toggleGenre}
        clearGenres={feed.clearGenres}
        cinemaMode
    />;

    return (
        <div className={`home-layout${inTheatersOnly ? ' home-layout-cinema' : ''}`}>
            {!isMobile && !inTheatersOnly && homeFilters}
            {inTheatersOnly && <div className='cinema-genre-area'>{cinemaGenreFilter}</div>}
            <HomeResults
                releaseRange={feed.releaseRange}
                inTheatersOnly={feed.inTheatersOnly}
                movies={feed.movies}
                setMovies={feed.setMovies}
                loading={feed.loading}
                error={feed.error}
                hasMore={feed.hasMore}
                sentinelRef={feed.sentinelRef}
                retry={feed.retry}
                selectedProvider={feed.selectedProvider}
                setSelectedProvider={feed.setSelectedProvider}
                providers={feed.providers}
                providersLoading={feed.providersLoading}
                showProviderFilter={!inTheatersOnly && (isMobile || !platformDocked)}
                platformAnchorRef={platformAnchorRef}
                imaxOnly={feed.imaxOnly}
                setImaxOnly={feed.setImaxOnly}
                filtersButton={isMobile && !inTheatersOnly && <button type='button' className='home-filter-trigger' aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><FiSliders aria-hidden='true' />Filtros{feed.selectedGenres.length > 0 && <span className='filter-count'>{feed.selectedGenres.length}</span>}</button>}
                filterPanel={isMobile && !inTheatersOnly && filtersOpen && <div className='home-filter-backdrop' onClick={() => setFiltersOpen(false)}><div className='home-filter-popover' role='dialog' aria-modal='true' aria-labelledby='home-filter-heading' onClick={(event) => event.stopPropagation()}><button type='button' className='home-filter-close' aria-label='Cerrar filtros' onClick={() => setFiltersOpen(false)}><FiX /></button>{homeFilters}</div></div>}
            />
        </div>
    );
};

export default Home;
