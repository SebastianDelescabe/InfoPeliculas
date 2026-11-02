import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notify } from '../../helpers/notify';
import { searchResults } from '../../helpers/searchResults';
import Card from '../Card/Card';

/** Lee la búsqueda de la URL, muestra resultados y sincroniza favoritos. */
const Results = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const [moviesResults, setMoviesResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Cancela el resultado anterior si cambia el término mientras se consulta.
    useEffect(() => {
        let active = true;
        let redirectTimer;
        if (!keyword) {
            setMoviesResults([]);
            setLoading(false);
            setError(false);
            return undefined;
        }

        setMoviesResults([]);
        setLoading(true);
        setError(false);
        searchResults(keyword)
            .then((response) => {
                if (!active) return;
                if (response.length === 0) {
                    notify('No se encontraron películas para esa búsqueda', 'warning');
                    redirectTimer = window.setTimeout(() => navigate('/home'), 1000);
                    return;
                }
                setMoviesResults(response);
                try {
                    localStorage.setItem('results', JSON.stringify(response));
                } catch {
                    // Los resultados siguen visibles aunque no puedan guardarse.
                }
            })
            .catch(() => {
                if (!active) return;
                setError(true);
                notify('No se pudo completar la búsqueda.', 'error');
            })
            .finally(() => { if (active) setLoading(false); });

        return () => {
            active = false;
            window.clearTimeout(redirectTimer);
        };
    }, [keyword, navigate]);

    return (
        <section className='search' aria-labelledby='search-heading'>
            <h2 id='search-heading'>Resultados <em>{keyword}</em></h2>
            {loading && <p className='loading-state'>Buscando películas…</p>}
            {error && <p className='empty-state'>Revisá tu conexión e intentá buscar de nuevo.</p>}
            {!loading && !error && moviesResults.length === 0 && keyword && <p className='empty-state'>No hay resultados para mostrar.</p>}
            <div className='movie-grid'>
                {moviesResults.map((movie) => <Card
                    key={movie.id}
                    movie={movie}
                    moviesResults={moviesResults}
                    setMoviesResults={setMoviesResults}
                />)}
            </div>
        </section>
    );
};

export default Results;
