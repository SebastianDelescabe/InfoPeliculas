import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { AppContext } from '../../helpers/AppContext';

const Card = ({ movie, moviesResults, setMoviesResults }) => {

    const { setMovies, movies, favorites, setFavorites } = useContext(AppContext)
    localStorage.setItem('favorites', JSON.stringify(favorites)) //Guardo cambios que se van generando en favoritos

    //---Lo importante para entender,es saber que tipo de pelicula se quiere agregar a favoritos, puede ser un resultado de busqueda o una de mi lista por "default"--

    const addFavorite = () => {
        //Hago una copia del estado que vaya a usar, segun necesite la aplicacion.
        let items = [];

        if (moviesResults) {
            items = [...moviesResults]
        } else {
            items = [...movies]
        }
        let index = items.findIndex(e => e.id === movie.id);
        // 3. Reemplazo la propiedad y uso el item, en el siguiente paso agregar ese item al estado favoritos.
        let item = items[index]
        item.favorite = true;

        //Verifico que el id no se encuentre en favoritos
        const inFavorites = favorites.find(favorite => favorite.id === movie.id)
        if (!inFavorites) {
            //Si no esta en favoritos lo guardo en el estado favorites
            setFavorites(favorite => [...favorite, item])
        } else {
            //Si ya esta dentro del estado, envio el error
            swal("Error", "Ya se encuentra en favoritos", "error");
        }
        //Si no existe moviesResults, es que no estoy buscando nada y trabajo con mi estado original movies.
        if (moviesResults) {
            setMoviesResults(items)//Guardo cambios para que se actualice en vivo el cambio de "corazon"
            localStorage.setItem('results', JSON.stringify(items))
        } else {
            setMovies(items) //Guardo cambios ya que la movie se encuentra en favoritos y necesito cambiar el "corazon"
            localStorage.setItem('movies', JSON.stringify(items)) //Guardo los cambios en localStorage para al refrescar aparezca como la ultima vez.
        }
    }

    const deleteFavorite = () => {
        //1.Saco elementos de favoritos en copia para no alterar original directamente.
        let favoritesItems = [...favorites];
        const deleteFavorite = favoritesItems.filter(e => e.id !== movie.id);
        setFavorites(deleteFavorite);

        let items = []
        //2.Si existe moviesResults significa que la pelicula es un resultado de buscar en el searchbar
        if (moviesResults) {
            items = [...moviesResults] //Guardo en items peliculas del resultado de la busqueda
        } else {
            //Guardo en items peliculas originales ya que se va a modificar una de ellas
            items = [...movies]
        }

        //3.Para los dos es igual, busco en mi estado (el que haya entrado en el paso aterior) el indice de la pelicula que se clickeó
        const index = items.findIndex(e => e.id === movie.id)
        //* Uso condicion en caso de no haber entrado y definido items */
        if(index !== -1 ){
            items[index].favorite = false  //Cambio su propiedad para setear en falso y sacar la pelicula de favoritos
        }

        //4.Hago la misma condicion saber cual estado actualizar.
        if (moviesResults) {
            setMoviesResults(items)//Guardo cambios para que se actualice en vivo el cambio de "corazon"
            localStorage.setItem('results', JSON.stringify(items))
        } else {
            setMovies(items)//Guardo cambios para que se actualice en vivo el cambio de "corazon"
            localStorage.setItem('movies', JSON.stringify(movies)) //Guardo los cambios en localStorage para al refrescar aparezca como la ultima vez.
        }
    }

    return (
        <div className='col-3'>
            <div className=" animate__animated animate__fadeIn animate__delay-0.2s card my-4">
                <Link to={`/detalle?movieID=${movie.id}`}>
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} height={420} width={305} alt="Not Found" />
                </Link>
                {
                    movie.favorite ? <button onClick={deleteFavorite} className='fav-icon'>♥</button> : <button onClick={addFavorite} className='fav-icon'>♡</button>
                }
                <div className="card-body">
                    <h5 className="card-title m2">{movie.title.substring(0, 25)}</h5>
                    <p className="card-text">{movie.overview.substring(0, 60)}...</p>
                    <Link to={`/detalle?movieID=${movie.id}`} style={{ display: 'flex', justifyContent: 'center' }} className="btn btn-info">Detalles</Link>
                </div>
            </div>
        </div>
    )
}

export default Card