import React, { useState } from 'react';
import { AppContext } from './helpers/AppContext';

import 'animate.css';
import './App.css';
import AppRouter from './routes/AppRoute';

function App() {

  const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(localFavorites);

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


