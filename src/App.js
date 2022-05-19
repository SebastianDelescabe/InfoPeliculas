import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Results, Login, Detail, Home, Header, Favorites } from './components';
import { AppContext } from './helpers/AppContext';
import { getInfo } from './helpers/getInfo';
import swal from 'sweetalert';

import 'animate.css';
import './app.css'

function App() {

  const localMovies = JSON.parse(localStorage.getItem('movies'))
  const localFavorites = JSON.parse(localStorage.getItem('favorites')) || []

  const [movies, setMovies] = useState(localMovies)
  const [favorites, setFavorites] = useState(localFavorites)

  useEffect(() => {
    if (!movies) { /* eslint-disable */
      getInfo()
        .then((response) => {
          setMovies(response)
        })
        .catch(err => {
          swal("Error", "No se pudo cargar informacion", "error");
        })
    }
  }, [setMovies])

  return (
    <AppContext.Provider value={{
      movies,
      setMovies,
      favorites,
      setFavorites
    }}>
      <div className='container mt-3'>
        <Header />
        <Routes >
          <Route exact path="/" element={<Login />} />
          <Route path="/listado" element={<Home />} />
          <Route path="/detalle" element={<Detail />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Routes >
      </div>
    </AppContext.Provider>
  );
}

export default App;


