import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiBookmark, FiCalendar, FiCompass, FiFilm, FiMenu, FiMonitor, FiX, FiZap } from 'react-icons/fi';
import Search from '../Search/Search';

/** Navegación principal con accesos a descubrir, cartelera, próximos y mi lista. */
const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
    const isAuthenticated = Boolean(sessionStorage.getItem('token'));
    const isCinemaActive = location.pathname === '/home' && searchParams.get('scope') === 'theaters';
    const isDiscoverActive = location.pathname === '/home' && !isCinemaActive;

    useEffect(() => {
        const media = window.matchMedia('(max-width: 760px)');
        const update = () => {
            setIsMobile(media.matches);
            if (!media.matches) setMenuOpen(false);
        };
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    // Cierra la sesión local y envía al usuario a la pantalla de acceso.
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const navigationLinks = <ul className='navbar-nav' onClick={(event) => { if (event.target.closest('a')) setMenuOpen(false); }}>
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
                <FiZap aria-hidden='true' /><span>Encontrar</span>
            </Link>
        </li>
    </ul>;

    const mobileMenu = isMobile && createPortal(<>
        <button type='button' className={`nav-backdrop${menuOpen ? ' is-open' : ''}`} aria-label='Cerrar menú' onClick={() => setMenuOpen(false)} />
        <div className={`mobile-menu-popup${menuOpen ? ' is-open' : ''}`} aria-label='Menú principal' aria-hidden={!menuOpen}>
            <button type='button' className='home-filter-close mobile-menu-close' aria-label='Cerrar menú' onClick={() => setMenuOpen(false)}><FiX /></button>
            {navigationLinks}
        </div>
    </>, document.body);

    return (
        <>
        <header className={`site-header${menuOpen ? ' menu-open' : ''}`}>
            <nav className='navbar' aria-label='Navegación principal'>
                <Link className='navbar-brand' to='/home' onClick={() => setMenuOpen(false)}><span className='brand-mark'><FiFilm aria-hidden='true' /></span><span className='brand-word'>DELE<span>FLIX</span></span></Link>
                {!isMobile && <div className='navbar-content'>{navigationLinks}</div>}
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
                <button className='mobile-menu-toggle' type='button' aria-label={menuOpen ? 'Menú abierto' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><FiMenu /></button>
            </nav>
        </header>
        {mobileMenu}
        </>
    );
};

export default Header;
