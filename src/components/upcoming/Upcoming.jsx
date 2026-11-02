import React, { useEffect, useState } from 'react';
import { upcoming } from '../../helpers/upcoming';
import Card from '../Card/Card';
import { notify } from '../../helpers/notify';

/** Consulta y presenta los próximos estrenos confirmados en Argentina. */
const Upcoming = () => {
    const [upcomingData, setUpcomingData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Evita actualizar el estado si el usuario abandona la pantalla durante la consulta.
    useEffect(() => {
        let active = true;
        upcoming()
            .then((response) => { if (active) setUpcomingData(response); })
            .catch(() => { if (active) notify('No se pudieron cargar los próximos estrenos', 'error'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    return (
        <section aria-labelledby='upcoming-heading'>
            <h1 id='upcoming-heading' className='page-heading'>Muy <span>próximamente</span></h1>
            {loading && <p className='loading-state'>Cargando próximos estrenos…</p>}
            {!loading && upcomingData.length === 0 && <p className='empty-state'>No hay próximos estrenos para mostrar.</p>}
            <div className='movie-grid'>
                {upcomingData.map((movie) => <Card key={movie.id} movie={movie} />)}
            </div>
        </section>
    );
};

export default Upcoming;
