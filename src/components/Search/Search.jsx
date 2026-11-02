import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { notify } from '../../helpers/notify';

const Search = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const submitHandler = (event) => {
        event.preventDefault();
        const keyword = event.currentTarget.text.value.trim();

        if (!token) notify('Iniciá sesión para buscar películas', 'warning');
        else if (!keyword) notify('Escribí el nombre de una película', 'warning');
        else if (keyword.length < 4) notify('Escribí al menos cuatro caracteres', 'warning');
        else {
            event.currentTarget.reset();
            navigate(`/results?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <form onSubmit={submitHandler} className='header-search'>
            <input name='text' type='search' placeholder='Buscar películas…' aria-label='Buscar películas' />
            <button className='icon-button' type='submit' aria-label='Buscar'><FiSearch /></button>
        </form>
    );
};

export default Search;
