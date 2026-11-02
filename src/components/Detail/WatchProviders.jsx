import React from 'react';

/** Muestra la disponibilidad de la película en Argentina agrupada por modalidad. */
const WatchProviders = ({ providers, loading, error }) => {
    const groups = [
        ['Suscripción', providers?.flatrate],
        ['Gratis', providers?.free],
        ['Con anuncios', providers?.ads],
        ['Alquiler', providers?.rent],
        ['Compra', providers?.buy]
    ].filter(([, items]) => items?.length);

    return (
        <section className='watch-section' aria-labelledby='watch-heading'>
            <h2 id='watch-heading'>Dónde ver en Argentina</h2>
            {loading && <p className='watch-status'>Consultando plataformas…</p>}
            {error && <p className='watch-status'>No se pudo consultar la disponibilidad.</p>}
            {providers === null && <p className='watch-status'>TMDB no tiene datos de disponibilidad para esta película en Argentina.</p>}
            {providers && <>
                {groups.length > 0 ? <div className='watch-groups'>
                    {groups.map(([label, items]) => <div className='watch-provider-group' key={label}>
                        <h3>{label}</h3>
                        <div className='watch-provider-list'>
                            {items.map((provider) => <div className='watch-provider-chip' key={provider.provider_id}>
                                <img src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt='' loading='lazy' />
                                <span>{provider.provider_name}</span>
                            </div>)}
                        </div>
                    </div>)}
                </div> : <p className='watch-status'>No hay opciones reportadas para esta película en Argentina.</p>}
                <small className='watch-credit'>Datos de disponibilidad: JustWatch</small>
            </>}
        </section>
    );
};

export default WatchProviders;
