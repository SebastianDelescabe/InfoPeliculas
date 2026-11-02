import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiBookmark, FiCalendar, FiCompass, FiMonitor, FiZap } from 'react-icons/fi';
import Search from '../Search/Search';

/** Navegación principal con accesos a descubrir, cartelera, próximos y mi lista. */
const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isAuthenticated = Boolean(sessionStorage.getItem('token'));
    const isCinemaActive = location.pathname === '/home' && searchParams.get('scope') === 'theaters';
    const isDiscoverActive = location.pathname === '/home' && !isCinemaActive;

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
                    <li className='nav-item'>
                        <Link className={`nav-link ${isDiscoverActive ? 'active' : ''}`} to='/home' aria-current={isDiscoverActive ? 'page' : undefined}>
                            <FiCompass aria-hidden='true' /><span>Descubrir</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className={`nav-link ${isCinemaActive ? 'active' : ''}`} to='/home?scope=theaters' aria-current={isCinemaActive ? 'page' : undefined}>
                            <FiMonitor aria-hidden='true' /><span>En cines</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className={`nav-link ${location.pathname === '/upcoming' ? 'active' : ''}`} to='/upcoming' aria-current={location.pathname === '/upcoming' ? 'page' : undefined}>
                            <FiCalendar aria-hidden='true' /><span>Próximamente</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`} to='/favorites' aria-current={location.pathname === '/favorites' ? 'page' : undefined}>
                            <FiBookmark aria-hidden='true' /><span>Mi lista</span>
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className={`nav-link nav-link-quiz ${location.pathname === '/quiz' ? 'active' : ''}`} to='/quiz' aria-current={location.pathname === '/quiz' ? 'page' : undefined}>
                            <FiZap aria-hidden='true' /><span>Encontrar peli</span>
                        </Link>
                    </li>
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
