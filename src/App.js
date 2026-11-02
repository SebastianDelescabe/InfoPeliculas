import React, { useEffect, useState } from 'react';
import { AppContext } from './helpers/AppContext';
import 'animate.css';
import './App.css';
import AppRouter from './routes/AppRoute';

function readArrayFromStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function App() {
  const [movies, setMovies] = useState(() => readArrayFromStorage('movies'));
  const [favorites, setFavorites] = useState(() => readArrayFromStorage('favorites'));
  const [watched, setWatched] = useState(() => readArrayFromStorage('watched'));

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  return (
    <AppContext.Provider value={{ movies, setMovies, favorites, setFavorites, watched, setWatched }}>
      <AppRouter />
    </AppContext.Provider>
  );
}

export default App;
