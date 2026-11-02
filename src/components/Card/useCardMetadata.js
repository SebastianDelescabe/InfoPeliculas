import { useEffect, useState } from 'react';
import { getNowPlayingMovieIds, getWatchProviders } from '../../helpers/tmdb';

/** Carga proveedores y cartelera cuando la tarjeta se acerca a la vista. */
const useCardMetadata = (movie, cardRef) => {
    const [watchProviders, setWatchProviders] = useState(undefined);
    const [inTheaters, setInTheaters] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card || movie.upcoming) return undefined;
        let active = true;

        const loadMetadata = () => {
            getWatchProviders(movie.id)
                .then((providers) => { if (active) setWatchProviders(providers); })
                .catch(() => { if (active) setWatchProviders(null); });
            getNowPlayingMovieIds()
                .then((movieIds) => { if (active) setInTheaters(movieIds.has(movie.id)); })
                .catch(() => {});
        };

        if (!('IntersectionObserver' in window)) {
            loadMetadata();
            return () => { active = false; };
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            loadMetadata();
        }, { rootMargin: '250px 0px' });

        observer.observe(card);
        return () => {
            active = false;
            observer.disconnect();
        };
    }, [cardRef, movie.id, movie.upcoming]);

    return { watchProviders, inTheaters };
};

export default useCardMetadata;
