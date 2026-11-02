import React from 'react';
import Card from '../Card/Card';

/** Encabezado, tarjetas y estados de carga del listado principal. */
const HomeResults = ({
    releaseRange,
    inTheatersOnly,
    movies,
    setMovies,
    loading,
    error,
    hasMore,
    sentinelRef,
    retry,
    selectedProvider,
    setSelectedProvider,
    providers,
    providersLoading
}) => (
    <section className='home-results' aria-labelledby='home-results-heading'>
        <div className='section-toolbar'>
            <div>
                <h1 id='home-results-heading' className='page-heading'>
                    {inTheatersOnly
                        ? <>Películas <span>en cines</span></>
                        : releaseRange === 'all' ? <>Todas las <span>películas</span></> : <>Últimos <span>estrenos</span></>}
                </h1>
                <p className='section-subtitle'>
                    {inTheatersOnly
                        ? 'Películas actualmente en cartelera en Argentina.'
                        : releaseRange === 'all'
                            ? 'Películas estrenadas en Argentina, ordenadas por popularidad o puntaje.'
                            : 'Estrenos en Argentina del último año, ordenados por popularidad o puntaje.'}
                </p>
            </div>
            <div className='home-filters'>
                <label className='provider-filter' htmlFor='provider-filter'>
                    <span>Plataforma</span>
                    <select id='provider-filter' value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)} disabled={providersLoading}>
                        <option value=''>{providersLoading ? 'Cargando plataformas…' : 'Todas las plataformas'}</option>
                        {providers.map((provider) => <option key={provider.provider_id} value={provider.provider_id}>{provider.provider_name}</option>)}
                    </select>
                </label>
            </div>
        </div>

        <div className='movie-grid'>
            {movies.map((movie) => <Card
                key={movie.id}
                movie={movie}
                moviesResults={movies}
                setMoviesResults={setMovies}
            />)}
        </div>
        {loading && <p className='loading-state'>Cargando más películas…</p>}
        {error && <button className='btn' onClick={retry}>Reintentar</button>}
        {!loading && !error && movies.length === 0 && <p className='empty-state'>No hay películas para mostrar con estos filtros.</p>}
        {!hasMore && movies.length > 0 && <p className='empty-state'>Llegaste al final de las películas disponibles con estos filtros.</p>}
        <div ref={sentinelRef} className='scroll-sentinel' aria-hidden='true' />
    </section>
);

export default HomeResults;
