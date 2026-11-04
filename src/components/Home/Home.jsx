import React, { useContext, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import swal from 'sweetalert';
import { AppContext } from '../../helpers/AppContext';
import { getInfo } from '../../helpers/getInfo';
import { Card } from '../index';

const Home = () => {
    //Si quiero salir de componente listado si no tengo nada en el sessionstorage
    let token = sessionStorage.getItem('token')

    const { movies, setMovies } = useContext(AppContext)
    // La página actual y total permiten pedir páginas sucesivas y detenerse al final.
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const loadMoreRef = useRef(null)

    // Al entrar a Home se empieza una lista nueva desde la primera página.
    useEffect(() => {
        setMovies([])
        setPage(1)
        setTotalPages(null)
        setIsLoading(true)
    }, [setMovies])

    // Cada cambio de página dispara un fetch y agrega sus películas al final de la lista.
    useEffect(() => {
        let isCurrentRequest = true
        setIsLoading(true)

        getInfo(page)
            .then(({ movies: newMovies, totalPages: pages }) => {
                if (!isCurrentRequest) return

                setTotalPages(pages)
                setMovies((currentMovies) => {
                    // Se reemplaza la lista en la página 1 y se anexan las páginas siguientes.
                    const combinedMovies = page === 1 ? newMovies : [...currentMovies, ...newMovies]
                    // La verificación por ID evita duplicados entre páginas.
                    const uniqueMovies = combinedMovies.filter((movie, index, list) =>
                        list.findIndex((item) => item.id === movie.id) === index
                    )
                    // Popularidad es el criterio principal; fecha de estreno desempata.
                    return uniqueMovies.sort((a, b) =>
                        (b.popularity ?? 0) - (a.popularity ?? 0) ||
                        (b.release_date || '').localeCompare(a.release_date || '')
                    )
                })
            })
            .catch(() => {
                if (isCurrentRequest) {
                    swal("Error", "No se pudo cargar informacion", "error");
                }
            })
            .finally(() => {
                if (isCurrentRequest) setIsLoading(false)
            });

        // Evita que una respuesta atrasada cambie la lista después de salir de Home.
        return () => {
            isCurrentRequest = false
        }
    }, [page, setMovies]);

    // El observador pide la página siguiente cuando el elemento final entra en pantalla.
    useEffect(() => {
        const loadMoreElement = loadMoreRef.current
        if (!loadMoreElement || isLoading || totalPages === null || page >= totalPages) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setPage((currentPage) => currentPage + 1)
            }
        }, { rootMargin: '200px' })

        observer.observe(loadMoreElement)
        // Se desconecta al cambiar de página o salir de Home para evitar observadores duplicados.
        return () => observer.disconnect()
    }, [isLoading, page, totalPages]);

    return (
        <>
            {!token && <Navigate to='/' />}
            <div className='row'>
                {movies && movies.map((movie) => (
                    <Card movie={movie} key={movie.id} />
                ))}
            </div>
            {/* Este elemento invisible marca el final de la lista para el scroll infinito. */}
            <div ref={loadMoreRef} aria-hidden="true" />
            {/* Indicador visible mientras se cargan más películas. */}
            {isLoading && <p className="text-center">Cargando películas...</p>}
        </>
    )
}

export default Home
