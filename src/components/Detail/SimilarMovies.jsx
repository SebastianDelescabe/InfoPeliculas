import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const POSTER_FALLBACK = 'https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png';

/** Recomienda títulos de TMDB relacionados con la película actual. */
const SimilarMovies = ({ movies, currentMovieId }) => {
    const trackRef = useRef(null);
    const pausedRef = useRef(false);
    const recommendations = (movies?.results || [])
        .filter((movie) => movie.id !== Number(currentMovieId) && movie.poster_path)
        .slice(0, 6);

    // Avanza una tarjeta periódicamente y vuelve al comienzo al llegar al final.
    useEffect(() => {
        const track = trackRef.current;
        if (!track || recommendations.length < 2) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const timer = window.setInterval(() => {
            if (pausedRef.current) return;
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 0) return;

            const step = track.firstElementChild?.getBoundingClientRect().width
                + parseFloat(window.getComputedStyle(track).columnGap || 0);
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 8) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: step || track.clientWidth * 0.8, behavior: 'smooth' });
            }
        }, 4800);

        return () => window.clearInterval(timer);
    }, [recommendations.length]);

    const moveCarousel = (direction) => {
        const track = trackRef.current;
        if (!track) return;
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        const step = track.firstElementChild?.getBoundingClientRect().width
            + parseFloat(window.getComputedStyle(track).columnGap || 0);
        const maxScroll = track.scrollWidth - track.clientWidth;
        const target = track.scrollLeft + direction * (step || track.clientWidth * 0.8);

        if (direction < 0 && target < 0) track.scrollTo({ left: maxScroll, behavior });
        else if (direction > 0 && target >= maxScroll) track.scrollTo({ left: 0, behavior });
        else track.scrollTo({ left: target, behavior });
    };

    if (!recommendations.length) return null;

    return (
        <section
            className='similar-movies'
            aria-labelledby='similar-movies-heading'
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
            onFocusCapture={() => { pausedRef.current = true; }}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) pausedRef.current = false;
            }}
        >
            <div className='similar-movies-header'>
                <h2 id='similar-movies-heading'>También te puede gustar</h2>
                {recommendations.length > 1 && <div className='carousel-controls'>
                    <button type='button' aria-label='Películas recomendadas anteriores' onClick={() => moveCarousel(-1)}><FiChevronLeft /></button>
                    <button type='button' aria-label='Películas recomendadas siguientes' onClick={() => moveCarousel(1)}><FiChevronRight /></button>
                </div>}
            </div>
            <div className='similar-movies-grid' ref={trackRef}>
                {recommendations.map((movie) => <Link
                    key={movie.id}
                    className='similar-movie'
                    to={`/detail?movieID=${movie.id}`}
                    aria-label={`Ver detalles de ${movie.title}`}
                >
                    <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : POSTER_FALLBACK}
                        alt={`Póster de ${movie.title}`}
                        loading='lazy'
                    />
                    <span className='similar-movie-title'>{movie.title}</span>
                    {movie.release_date && <small>{movie.release_date.slice(0, 4)}</small>}
                </Link>)}
            </div>
        </section>
    );
};

export default SimilarMovies;
