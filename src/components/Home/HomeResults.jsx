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
    providersLoading,
    showProviderFilter = true,
    platformAnchorRef,
    filtersButton,
    filterPanel,
    imaxOnly = false,
    setImaxOnly
}) => (
    <section className={`home-results${inTheatersOnly ? ' home-results-cinema' : ''}`} aria-labelledby='home-results-heading'>
        <div className='section-toolbar'>
            <div>
                <h1 id='home-results-heading' className='page-heading'>
                    {inTheatersOnly ? <>En <span>cartelera</span></> : releaseRange === 'all' ? <>Todas las <span>películas</span></> : <>Estrenos <span>destacados</span></>}
                </h1>
                {!inTheatersOnly && <p className='section-subtitle home-desktop-subtitle'>
                    {releaseRange === 'all'
                            ? 'Películas estrenadas en Argentina, ordenadas por popularidad o puntaje.'
                            : 'Estrenos en Argentina del último año, ordenados por popularidad o puntaje.'}
                </p>}
                {!inTheatersOnly && <p className='section-subtitle home-mobile-subtitle'>
                    {releaseRange === 'all'
                            ? 'Argentina · Todas las fechas · Popularidad o puntaje'
                            : 'Argentina · Últimos 12 meses · Popularidad o puntaje'}
                </p>}
            </div>
            <div className='home-toolbar-actions'>
            {inTheatersOnly && <button type='button' className={`cinema-imax-toggle${imaxOnly ? ' is-active' : ''}`} aria-pressed={imaxOnly} onClick={() => setImaxOnly(!imaxOnly)}><span>IMAX</span></button>}
            <span ref={platformAnchorRef} className='platform-filter-anchor' aria-hidden='true' />
            {showProviderFilter && <div className='home-filters'>
                <label className='provider-filter provider-filter-compact' htmlFor='provider-filter'>
                    <span className='provider-filter-label'>Plataforma</span>
                    <select id='provider-filter' value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)} disabled={providersLoading}>
                        <option value=''>{providersLoading ? 'Cargando plataformas…' : 'Todas las plataformas'}</option>
                        {providers.map((provider) => <option key={provider.provider_id} value={provider.provider_id}>{provider.provider_name}</option>)}
                    </select>
                </label>
                {selectedProvider && <button type='button' className='provider-clear-button' onClick={() => setSelectedProvider('')} aria-label='Quitar filtro de plataforma' title='Quitar filtro de plataforma'>×</button>}
            </div>}
            <div className='home-filter-control'>{filtersButton}{filterPanel}</div>
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
