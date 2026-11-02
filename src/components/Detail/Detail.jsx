import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { getInfoById } from '../../helpers/getInfoById';

const Detail = () => {
  const token = sessionStorage.getItem('token');
  const [searchParams] = useSearchParams();
  const movieID = searchParams.get('movieID');
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    if (movieID) getInfoById(movieID).then(setMovieData).catch(() => setMovieData(null));
  }, [movieID]);

  if (!token) return <Navigate to='/login' replace />;
  if (!movieData) return <p className='loading-state'>Cargando película…</p>;

  const poster = movieData.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`
    : 'https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png';
  const releaseDate = movieData.release_date && /^\d{4}-\d{2}-\d{2}$/.test(movieData.release_date)
    ? movieData.release_date.split('-').reverse().join('-')
    : movieData.release_date || 'Sin fecha';
  const trailers = movieData.videos?.results?.filter((video) =>
    video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type) && video.key
  ) || [];
  const trailer = [...trailers].sort((first, second) => {
    const score = (video) => (video.official ? 4 : 0)
      + (video.type === 'Trailer' ? 2 : 0)
      + (video.iso_639_1 === 'es' ? 2 : video.iso_639_1 === 'en' ? 1 : 0);
    return score(second) - score(first);
  })[0];

  return (
    <div className='detail-page animate__animated animate__fadeIn'>
      <section className='detail-layout'>
        <img src={poster} className='detail-poster' alt={`Póster de ${movieData.title}`} />
        <div className='detail-copy'>
          <h1>{movieData.title}</h1>
          {movieData.tagline && <p className='detail-tagline'>{movieData.tagline}</p>}
          <h2>Sinopsis</h2>
          <p>{movieData.overview || 'Todavía no hay una sinopsis disponible.'}</p>
          <div className='detail-meta'><span><strong>Rating:</strong> {Number(movieData.vote_average).toFixed(1)} <AiFillStar /></span>
            <span><strong>Estreno:</strong> {releaseDate}</span></div>
          <h2>Géneros</h2>
          <ul className='ul-detail'>{movieData.genres?.map((genre) => <li className='li-detail' key={genre.id}>{genre.name}</li>)}</ul>
          <button onClick={() => window.history.back()} className='btn back-button'>Volver</button>
        </div>
      </section>
      <section className='trailer-section' aria-labelledby='trailer-heading'>
        <h2 id='trailer-heading'>Tráiler</h2>
        {trailer ? <div className='trailer-player'>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}?rel=0`}
            title={`Tráiler de ${movieData.title}`}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
            loading='lazy'
          />
        </div> : <p className='trailer-unavailable'>Todavía no hay un tráiler disponible para esta película.</p>}
      </section>
    </div>
  );
};

export default Detail;
