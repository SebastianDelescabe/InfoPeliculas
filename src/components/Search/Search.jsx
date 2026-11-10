import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { notify } from '../../helpers/notify';

const SEARCH_PLACEHOLDER = 'Buscar películas…';

/** Valida y envía el término de búsqueda a la ruta de resultados. */
const Search = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
    const [searchOpen, setSearchOpen] = useState(() => !window.matchMedia('(max-width: 760px)').matches);
    const [placeholder, setPlaceholder] = useState(SEARCH_PLACEHOLDER);

    useEffect(() => {
        const media = window.matchMedia('(max-width: 760px)');
        const update = () => {
            setIsMobile(media.matches);
            setSearchOpen(!media.matches);
        };
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!searchOpen) {
            setPlaceholder(SEARCH_PLACEHOLDER);
            return undefined;
        }
        let visibleCharacters = 0;
        setPlaceholder('');
        const timer = window.setInterval(() => {
            visibleCharacters += 1;
            setPlaceholder(SEARCH_PLACEHOLDER.slice(0, visibleCharacters));
            if (visibleCharacters >= SEARCH_PLACEHOLDER.length) window.clearInterval(timer);
        }, 65);
        return () => window.clearInterval(timer);
    }, [isMobile, searchOpen]);

    const submitHandler = (event) => {
        event.preventDefault();
        const keyword = event.currentTarget.text.value.trim();

        if (!token) notify('Iniciá sesión para buscar películas', 'warning');
        else if (!keyword) notify('Escribí el nombre de una película', 'warning');
        else if (keyword.length < 4) notify('Escribí al menos cuatro caracteres', 'warning');
        else {
            event.currentTarget.reset();
            navigate(`/results?keyword=${encodeURIComponent(keyword)}`);
            setSearchOpen(false);
        }
    };

    return (
        <form onSubmit={submitHandler} className={`header-search${searchOpen ? ' search-expanded' : ''}`}>
            <input name='text' type='search' placeholder={placeholder} aria-label='Buscar películas' tabIndex={searchOpen ? 0 : -1} />
            <button className='icon-button' type={isMobile ? 'button' : 'submit'} aria-label={isMobile ? (searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda') : 'Buscar'} title={isMobile ? (searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda') : 'Buscar'} onClick={() => { if (isMobile) setSearchOpen(!searchOpen); }}>
                {isMobile && searchOpen ? <FiX /> : <FiSearch />}
            </button>
        </form>
    );
};

export default Search;
