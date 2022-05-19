import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai';
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
    <>
      {!token && <Navigate to='/' />}
      {!movieData && <p>Cargando...</p>}
      {movieData &&
        <>
          <div className='row h-100'>
            <div className='col-4 animate__animated animate__fadeInLeft animate__delay-0.2s'>
              {
                movieData.poster_path !== null ?
                  <img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} className='img-fluid my-5' alt='img not found' />
                  :
                  <img src="https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png" className='img-fluid my-5' alt='img not found' />
              }
            </div>
            <div className='col-8 my-5'>
              <h1>{movieData.title}</h1>
              <h2 className='mb-5'>{movieData.tagline}</h2>
              <h5>Sinopsis</h5>
              <p>{movieData.overview}</p>
              <h5 className='my-5'>Rating: {movieData.vote_average}<AiFillStar style={{ color: 'orange', marginBottom: '5', marginLeft: '3' }} /></h5>
              <h5>Generos:</h5>
              <ul>
                {movieData.genres.map(e => <li key={e.id}>{e.name}</li>)}
              </ul>
              <h5 className='my-5'>Fecha de estreno: {movieData.release_date}</h5>
            </div>
            <button onClick={handleOnBack} style={{ width: '100%' }} className="  btn btn-primary animate__animated animate__fadeInUp animate__delay-2s">Volver</button>
          </div>
        </>
      }
    </>
  )
}

export default Detail