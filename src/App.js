import React, { useEffect, useState } from 'react';
import { AppContext } from './helpers/AppContext';
import { getInfo } from './helpers/getInfo';
import swal from 'sweetalert';

import 'animate.css';
import './App.css';
import AppRouter from './routes/AppRoute';

function App() {

  const localMovies = JSON.parse(localStorage.getItem('movies')) || [];
  const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const [movies, setMovies] = useState(localMovies);
  const [favorites, setFavorites] = useState(localFavorites);

  useEffect(() => {
    if (movies.length === 0) { /* eslint-disable */
      getInfo()
        .then((response) => {
          setMovies(response)
          localStorage.setItem('movies', JSON.stringify(response))
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
      <AppRouter />
    </AppContext.Provider>
  );
}

export default App;


