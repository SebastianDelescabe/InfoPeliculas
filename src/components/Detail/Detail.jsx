import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { getInfoById } from '../../helpers/getInfoById';
import { getNowPlayingMovieIds, getWatchProviders } from '../../helpers/tmdb';
import MovieSummary from './MovieSummary';
import TrailerSection from './TrailerSection';
import WatchProviders from './WatchProviders';
import SimilarMovies from './SimilarMovies';
import Loader from '../Loader/Loader';

const FALLBACK_POSTER = 'https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png';

/** Carga una película y compone su resumen, disponibilidad y tráiler. */
const Detail = () => {
    const token = sessionStorage.getItem('token');
    const [searchParams] = useSearchParams();
    const movieID = searchParams.get('movieID');
    const [movieData, setMovieData] = useState(null);
    const [movieError, setMovieError] = useState(false);
    const [watchProviders, setWatchProviders] = useState(undefined);
    const [providersError, setProvidersError] = useState(false);
    const [inTheaters, setInTheaters] = useState(false);

    // Cada ficha nueva comienza desde arriba para no heredar el scroll anterior.
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [movieID]);

    // Obtiene los datos completos y evita aplicar respuestas de otra película.
    useEffect(() => {
        let active = true;
        setMovieData(null);
        setMovieError(false);
        if (!movieID) {
            setMovieError(true);
            return () => { active = false; };
        }

        getInfoById(movieID)
            .then((data) => { if (active) setMovieData(data); })
            .catch(() => { if (active) setMovieError(true); });
        return () => { active = false; };
    }, [movieID]);

    // Carga los servicios disponibles y el estado actual de cartelera.
    useEffect(() => {
        let active = true;
        setWatchProviders(undefined);
        setInTheaters(false);
        setProvidersError(false);
        if (movieID) {
            getWatchProviders(movieID)
                .then((providers) => { if (active) setWatchProviders(providers); })
                .catch(() => { if (active) setProvidersError(true); });
            getNowPlayingMovieIds()
                .then((movieIds) => { if (active) setInTheaters(movieIds.has(Number(movieID))); })
                .catch(() => {});
        }
        return () => { active = false; };
    }, [movieID]);

    if (!token) return <Navigate to='/login' replace />;
    if (movieError) return <p className='empty-state'>No se pudo cargar la ficha de esta película.</p>;
    if (!movieData) return <Loader label='Cargando película…' />;

    const poster = movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`
        : FALLBACK_POSTER;
    const releaseDate = movieData.release_date && /^\d{4}-\d{2}-\d{2}$/.test(movieData.release_date)
        ? movieData.release_date.split('-').reverse().join('/')
        : movieData.release_date || 'Sin fecha';
    const localToday = new Date();
    const today = new Date(localToday.getTime() - localToday.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    const argentinaReleaseDate = movieData.release_dates?.results
        ?.find((country) => country.iso_3166_1 === 'AR')
        ?.release_dates?.map((release) => release.release_date?.slice(0, 10))
        .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date || ''))
        .sort()[0];
    const isUpcoming = argentinaReleaseDate
        ? argentinaReleaseDate > today
        : /^\d{4}-\d{2}-\d{2}$/.test(movieData.release_date || '') && movieData.release_date > today;

    return (
        <div className='detail-page animate__animated animate__fadeIn'>
            <MovieSummary
                movie={movieData}
                poster={poster}
                releaseDate={releaseDate}
                upcoming={isUpcoming}
                inTheaters={inTheaters}
                onBack={() => window.history.back()}
            />
            <section className='detail-extras' aria-label='Disponibilidad y tráiler'>
                <WatchProviders
                    providers={watchProviders}
                    loading={watchProviders === undefined && !providersError}
                    error={providersError}
                />
                <TrailerSection movie={movieData} />
            </section>
            <SimilarMovies movies={movieData.recommendations} currentMovieId={movieID} />
        </div>
    );
};

export default Detail;
