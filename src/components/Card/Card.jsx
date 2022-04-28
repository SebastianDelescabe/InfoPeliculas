import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ movie, favourite }) => {

    return (
        <div className='col-3'>
            <div className=" animate__animated animate__fadeIn animate__delay-0.2s card my-4">
                {
                    !favourite ? (movie.poster_path !== null ?
                        <Link to={`/detalle?movieID=${movie.id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} height={420} width={305} alt="Not Found" />
                        </Link>
                        :
                        <Link to={`/detalle?movieID=${movie.id}`}>
                            <img src="https://cloupyblob.blob.core.windows.net/cloupy/image-not-found.png" height={420} width={305} alt="Not Found" />
                        </Link>)
                        :
                        <Link to={`/detalle?movieID=${movie.id}`}>
                            <img src={movie.imgURL} height={420} width={305} alt="Not Found" />
                        </Link>

                }
                {/* <Favourites movie={movie} /> */}
                <div className="card-body">
                    <h5 className="card-title m2">{movie.title.substring(0, 25)}</h5>
                    <p className="card-text">{movie.overview.substring(0, 60)}...</p>
                    <Link to={`/detalle?movieID=${movie.id}`} style={{ display: 'flex', justifyContent:'center' }} className="btn btn-info">Detalles</Link>
                </div>
            </div>
        </div>
    )
}

export default Card