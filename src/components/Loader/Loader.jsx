import React from 'react';

/** Indicador reutilizable que comunica la carga visualmente y con texto accesible. */
const Loader = ({ label = 'Cargando…' }) => (
    <div className='loading-indicator' role='status' aria-live='polite'>
        <span className='loading-spinner' aria-hidden='true' />
        <span className='loading-indicator-label'>{label}</span>
    </div>
);

export default Loader;
