import React from 'react';

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
    clearFilters
}) => (
    <aside className='home-filter-panel' aria-labelledby='home-filter-heading'>
        <h2 id='home-filter-heading'>Filtros</h2>
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
    </aside>
);

export default HomeFilters;
