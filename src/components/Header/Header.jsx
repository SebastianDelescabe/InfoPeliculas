import React from 'react'
import { Link } from 'react-router-dom'
import { Search } from '../index'

const Header = () => {
    return (
        <header>
            <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
                <div className='container'>
                    <Link className='navbar-brand' to='/'>SebaFlix</Link>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'></button>
                </div>
                <div className='collapse navbar-collapse' id='nabvarNav'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/'>Home</Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/listado'>Listado</Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/favoritos'>Favoritos</Link>
                        </li>
                    </ul>
                </div>
                <Search />
            </nav>
        </header>
    )
}

export default Header