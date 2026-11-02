import React, { useEffect, useMemo, useState } from 'react';
import { AppContext } from './helpers/AppContext';
import 'animate.css';
import './App.css';
import AppRouter from './routes/AppRoute';

// Lee listas guardadas y recupera valores seguros si el almacenamiento no es válido.
function readArrayFromStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

/** Inicializa los datos locales y provee el estado global a las rutas. */
function App() {
  const [movies, setMovies] = useState(() => readArrayFromStorage('movies'));
  const [favorites, setFavorites] = useState(() => readArrayFromStorage('favorites'));
  const [watched, setWatched] = useState(() => readArrayFromStorage('watched'));

  // La lista de películas vistas se guarda cada vez que cambia.
  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  // Mantiene estable el valor del contexto para evitar renders innecesarios.
  const contextValue = useMemo(() => ({
    movies, setMovies, favorites, setFavorites, watched, setWatched
  }), [movies, favorites, watched]);

  return (
    <AppContext.Provider value={contextValue}>
      <AppRouter />
    </AppContext.Provider>
  );
}

export default App;
