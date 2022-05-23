import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from '../index'

const Header = () => {

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
                </div>
                <div className='navbar-nav'>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/home'>Listado</Link>
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