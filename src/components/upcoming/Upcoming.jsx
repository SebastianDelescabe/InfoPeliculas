import React, { useEffect, useMemo, useState } from 'react';
import { upcoming } from '../../helpers/upcoming';
import Card from '../Card/Card';
import { notify } from '../../helpers/notify';

const getExpectedInterest = (movie) => movie.popularity || 0;

/** Consulta y presenta los próximos estrenos confirmados en Argentina. */
const Upcoming = () => {
    const [upcomingData, setUpcomingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('importance');

    // Evita actualizar el estado si el usuario abandona la pantalla durante la consulta.
    useEffect(() => {
        let active = true;
        upcoming()
            .then((response) => { if (active) setUpcomingData(response); })
            .catch(() => { if (active) notify('No se pudieron cargar los próximos estrenos', 'error'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const displayedMovies = useMemo(() => [...upcomingData].sort((first, second) => (
        sortBy === 'date'
            ? first.release_date.localeCompare(second.release_date) || getExpectedInterest(second) - getExpectedInterest(first)
            : getExpectedInterest(second) - getExpectedInterest(first) || first.release_date.localeCompare(second.release_date)
    )), [upcomingData, sortBy]);

    return (
        <section aria-labelledby='upcoming-heading'>
            <div className='section-toolbar upcoming-toolbar'>
                <div>
                    <h1 id='upcoming-heading' className='page-heading'>En <span>cines</span> próximamente</h1>
                </div>
                <label className='provider-filter upcoming-sort' htmlFor='upcoming-sort'>
                    <span>Ordenar por</span>
                    <select id='upcoming-sort' value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                        <option value='importance'>Más esperadas</option>
                        <option value='date'>Fecha más próxima</option>
                    </select>
                </label>
            </div>
            {loading && <p className='loading-state'>Cargando próximos estrenos…</p>}
            {!loading && upcomingData.length === 0 && <p className='empty-state'>No hay próximos estrenos para mostrar.</p>}
            <div className='movie-grid'>
                {displayedMovies.map((movie) => <Card key={movie.id} movie={movie} />)}
            </div>
        </section>
    );
};

export default Upcoming;
