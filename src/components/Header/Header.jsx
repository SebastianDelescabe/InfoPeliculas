import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Search from '../Search/Search';

/** Navegación principal, acceso a búsqueda y cierre de sesión. */
const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(sessionStorage.getItem('token'));

    // Cierra la sesión local y envía al usuario a la pantalla de acceso.
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className='site-header'>
            <nav className='navbar' aria-label='Navegación principal'>
                <Link className='navbar-brand' to='/home'>DELE<span>FLIX</span></Link>
                <ul className='navbar-nav'>
                    <li className='nav-item'><NavLink className='nav-link' to='/home'>Destacado</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='/upcoming'>Próximamente</NavLink></li>
                    <li className='nav-item'><NavLink className='nav-link' to='/favorites'>Favoritos</NavLink></li>
                </ul>
                <Search />
                {isAuthenticated && <button
                    className='logout-button'
                    onClick={handleLogout}
                    aria-label='Cerrar sesión'
                    title='Cerrar sesión'
                >
                    <svg aria-hidden='true' viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                        <polyline points='16 17 21 12 16 7' />
                        <line x1='21' y1='12' x2='9' y2='12' />
                    </svg>
                </button>}
            </nav>
        </header>
    );
};

export default Header;
