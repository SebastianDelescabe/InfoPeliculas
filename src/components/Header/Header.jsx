import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from '../index';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    let navigate = useNavigate()

    function handleOnClick() {
        sessionStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <header>
            <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
                <div className='container'>
                    <Link className='navbar-brand text-danger' to='/home'>DELEFLIX</Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarNav'
                        aria-controls='navbarNav'
                        aria-expanded='false'
                        aria-label='Toggle navigation'>
                    </button>
                    {
                        sessionStorage.getItem("token") ?
                            <div className='logutIcon' onClick={() => handleOnClick()} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </div>
                            : null
                    }
                </div>
                <div className='navbar-nav'>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/home'>Destacado</Link>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/upcoming'>Proximamente</Link>
                    </li>
                    <li className='nav-item text-danger'>
                        <Link className='nav-link text-danger' to='/favorites'>Favoritos</Link>
                    </li>
                </div>
                <Search />
            </nav>
        </header>
    )
}

export default Header