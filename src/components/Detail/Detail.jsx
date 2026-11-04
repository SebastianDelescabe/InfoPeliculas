import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AiFillStar, AiOutlineArrowLeft } from 'react-icons/ai';
import { getInfoById } from '../../helpers/getInfoById';

const Detail = () => {

  const token = sessionStorage.getItem('token');
  const [movieData, setMovieData] = useState(null)

  let query = new URLSearchParams(window.location.search);
  let movieID = query.get('movieID');

  useEffect(() => {
    getInfoById(movieID)
      .then((response) => {
        setMovieData(response)
      })
  }, [movieID])

  const handleOnBack = () => {
    window.history.back();
  }

  return (
    <div className='container'>
      {!token && <Navigate to='/' />}
      {!movieData && <p className="text-center py-5 text-secondary">Cargando película...</p>}
      {movieData &&
        <div className='row detail-layout animate__animated animate__fadeIn'>
          <button
            onClick={handleOnBack}
            className="detail-back"
            type="button"
          >
            <AiOutlineArrowLeft aria-hidden="true" />
            <span>Volver</span>
          </button>
          <div className='col-4 animate__animated animate__fadeInLeft animate__delay-0.2s'>
            {
              movieData.poster_path !== null ?
                <img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} className='detail-poster' alt={`Póster de ${movieData.title}`} />
                :
                <img src="https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png" className='detail-poster' alt={`Póster no disponible para ${movieData.title}`} />
            }
          </div>
          <div className='col-8 text-light d-flex flex-column detail-copy'>
            <h1>{movieData.title}</h1>
            <h2>{movieData.tagline}</h2>
            <h5>Sinopsis</h5>
            <p>{movieData.overview}</p>
            <h5 className='rating'>Rating: {Math.round(movieData.vote_average)}<AiFillStar style={{ color: '#f0ad4e' }} /></h5>
            <h5>Generos:</h5>
            <ul className='ul-detail'>
              {movieData.genres.map(e => <li className='li-detail' key={e.id}>{e.name}</li>)}
            </ul>
            <h5>Fecha de estreno: {movieData.release_date}</h5>
          </div>
        </div>
      }
    </div>
  )
}

export default Detail
