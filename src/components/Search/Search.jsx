import React from 'react';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

const Search = () => {

    const navigate = useNavigate()

    const token = sessionStorage.getItem('token')

    const sumbitHandler = (e) => {
        e.preventDefault();
        const keyword = e.currentTarget.text.value.trim();

        if (!token) {
            swal("", "Debe iniciar sesión", "warning");
            e.currentTarget.text.value = ''
        } else if (keyword.length === 0) {
            swal("", "Tiene que escribir algo", "warning");
        } else if (keyword.length < 4) {
            swal("", "Debe escribir cuatro o más caracteres", "warning");
        } else {
            e.currentTarget.text.value = '';
            navigate(`/results?keyword=${encodeURIComponent(keyword)}`);
        }
    }

    return (
        <form onSubmit={sumbitHandler} className='movie-search'>
            <label className='search-input-wrap'>
                <AiOutlineSearch className='search-icon' aria-hidden="true" />
                <input
                    className='search-input'
                    name='text'
                    type='text'
                    placeholder='Buscar películas...'
                    aria-label='Buscar películas'
                />
            </label>
            <button
                className='search-button'
                type="submit"
                aria-label='Buscar'
            >
                <AiOutlineSearch aria-hidden="true" />
            </button>
        </form>
    )
}

export default Search
