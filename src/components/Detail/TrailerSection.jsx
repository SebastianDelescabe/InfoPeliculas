import React from 'react';

/** Elige el tráiler más relevante y lo inserta desde YouTube sin cookies. */
const TrailerSection = ({ movie }) => {
    const trailers = movie.videos?.results?.filter((video) =>
        video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type) && video.key
    ) || [];
    const trailer = [...trailers].sort((first, second) => {
        const score = (video) => (video.official ? 4 : 0)
            + (video.type === 'Trailer' ? 2 : 0)
            + (video.iso_639_1 === 'es' ? 2 : video.iso_639_1 === 'en' ? 1 : 0);
        return score(second) - score(first);
    })[0];

    return (
        <section className='trailer-section' aria-labelledby='trailer-heading'>
            <h2 id='trailer-heading'>Tráiler</h2>
            {trailer ? <div className='trailer-player'>
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}?rel=0`}
                    title={`Tráiler de ${movie.title}`}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                    loading='lazy'
                />
            </div> : <p className='trailer-unavailable'>Todavía no hay un tráiler disponible para esta película.</p>}
        </section>
    );
};

export default TrailerSection;
