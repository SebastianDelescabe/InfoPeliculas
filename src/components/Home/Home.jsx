import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import HomeFilters from './HomeFilters';
import HomeResults from './HomeResults';
import useHomeFeed from './useHomeFeed';

/** Une el panel de filtros con el feed de películas destacadas. */
const Home = () => {
    const token = sessionStorage.getItem('token');
    const [searchParams, setSearchParams] = useSearchParams();
    const feed = useHomeFeed();
    const { inTheatersOnly, setInTheatersOnly } = feed;

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

    return (
        <div className='home-layout'>
            <HomeFilters
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
                clearFilters={clearFilters}
            />
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
            />
        </div>
    );
};

export default Home;
