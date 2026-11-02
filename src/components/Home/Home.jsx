import React from 'react';
import { Navigate } from 'react-router-dom';
import HomeFilters from './HomeFilters';
import HomeResults from './HomeResults';
import useHomeFeed from './useHomeFeed';

/** Une el panel de filtros con el feed de películas destacadas. */
const Home = () => {
    const token = sessionStorage.getItem('token');
    const feed = useHomeFeed();

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
                setInTheatersOnly={feed.setInTheatersOnly}
                selectedProvider={feed.selectedProvider}
                clearFilters={feed.clearFilters}
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
