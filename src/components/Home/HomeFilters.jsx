import React from 'react';
import { FiFilm, FiSliders } from 'react-icons/fi';

/** Panel lateral con los filtros de período, orden y género de Descubrir. */
const HomeFilters = ({
    releaseRange,
    setReleaseRange,
    selectedSort,
    setSelectedSort,
    genres,
    genresLoading,
    selectedGenres,
    genreFilterRef,
    toggleGenre,
    inTheatersOnly,
    selectedProvider,
    setSelectedProvider,
    providers = [],
    providersLoading = false,
    showPlatform = false,
    clearFilters,
    clearGenres,
    cinemaMode = false
}) => (
    <aside className={`home-filter-panel${cinemaMode ? ' cinema-genre-filter' : ' discover-filter-panel'}`} aria-labelledby='home-filter-heading'>
        {cinemaMode ? <>
            <div className='cinema-genre-heading'>
                <span className='cinema-genre-icon'><FiFilm aria-hidden='true' /></span>
                <div><h2 id='home-filter-heading'>Géneros</h2><p>Elegí tu próxima función</p></div>
            </div>
            {genresLoading ? <span className='cinema-genres-loading'>Cargando géneros…</span> : <div className='cinema-genre-chips'>
                {genres.map((genre) => {
                    const selected = selectedGenres.includes(String(genre.id));
                    return <button
                        key={genre.id}
                        type='button'
                        className={`cinema-genre-chip${selected ? ' is-selected' : ''}`}
                        aria-pressed={selected}
                        onClick={() => toggleGenre(genre.id)}
                    >{genre.name}</button>;
                })}
            </div>}
            {selectedGenres.length > 0 && <button type='button' className='cinema-clear-genres' onClick={clearGenres}>Limpiar géneros</button>}
        </> : <>
        <div className='discover-filter-heading'><span><FiSliders aria-hidden='true' /></span><h2 id='home-filter-heading'>Filtros</h2></div>
        {showPlatform && <label className='provider-filter' htmlFor='provider-filter-desktop'>
            <span>Plataforma</span>
            <select id='provider-filter-desktop' value={selectedProvider} onChange={(event) => setSelectedProvider(event.target.value)} disabled={providersLoading}>
                <option value=''>{providersLoading ? 'Cargando plataformas…' : 'Todas las plataformas'}</option>
                {providers.map((provider) => <option key={provider.provider_id} value={provider.provider_id}>{provider.provider_name}</option>)}
            </select>
        </label>}
        <label className='provider-filter' htmlFor='release-range-filter'>
            <span>Período</span>
            <select id='release-range-filter' value={releaseRange} onChange={(event) => setReleaseRange(event.target.value)}>
                <option value='last_year'>Último año</option>
                <option value='all'>Todas las películas</option>
            </select>
        </label>
        <label className='provider-filter' htmlFor='sort-filter'>
            <span>Ordenar por</span>
            <select id='sort-filter' value={selectedSort} onChange={(event) => setSelectedSort(event.target.value)}>
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
        <button
            type='button'
            className='clear-filters-button'
            onClick={clearFilters}
            disabled={!selectedProvider && selectedGenres.length === 0 && selectedSort === 'popularity.desc' && releaseRange === 'last_year' && !inTheatersOnly}
        >
            Limpiar filtros
        </button>
        </>}
    </aside>
);

export default HomeFilters;
