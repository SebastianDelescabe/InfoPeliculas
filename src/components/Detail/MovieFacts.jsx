import React from 'react';

const languageNames = {
    en: 'Inglés', es: 'Español', ja: 'Japonés', fr: 'Francés', ko: 'Coreano',
    it: 'Italiano', de: 'Alemán', zh: 'Chino', pt: 'Portugués', hi: 'Hindi'
};

// Toma la clasificación etaria argentina del primer lanzamiento que la informa.
const getArgentineCertification = (movie) => movie.release_dates?.results
    ?.find((country) => country.iso_3166_1 === 'AR')
    ?.release_dates?.find((release) => release.certification?.trim())?.certification;

// Convierte minutos en una duración breve para la ficha técnica.
const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return [hours && `${hours} h`, remainder && `${remainder} min`].filter(Boolean).join(' ');
};

/** Resume duración, clasificación, idioma y países de producción disponibles. */
const MovieFacts = ({ movie }) => {
    const facts = [
        ['Duración', formatRuntime(movie.runtime)],
        ['Clasificación AR', getArgentineCertification(movie)],
        ['Idioma original', languageNames[movie.original_language] || movie.original_language?.toUpperCase()],
        ['País', movie.production_countries?.map((country) => country.name).join(', ')]
    ].filter(([, value]) => value);

    if (!facts.length) return null;

    return (
        <section className='movie-facts' aria-labelledby='movie-facts-heading'>
            <h2 id='movie-facts-heading'>Ficha técnica</h2>
            <dl className='movie-facts-grid'>
                {facts.map(([label, value]) => <div className='movie-fact' key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                </div>)}
            </dl>
        </section>
    );
};

export default MovieFacts;
