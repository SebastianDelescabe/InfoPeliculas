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

  return (
    <section className='detail-layout animate__animated animate__fadeIn'>
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
  );
};

export default Detail;
