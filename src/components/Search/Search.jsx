import React from 'react';
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom';


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
            swal("", "Debe escribir cuatro o mas caracteres", "warning");
        } else {
            e.currentTarget.text.value = '';
            navigate(`/results?keyword=${keyword}`);
        }
    }

    return (
        <form onSubmit={sumbitHandler}
            className='d-flex aling-items-center'
        >
            <label className='form-label mb-0'>
                <input
                    className='form-control'
                    name='text'
                    style={{ height: 30, width: 350, marginLeft: 20, marginTop: 4 }}
                    type='text'
                    placeholder='Buscar...' />
            </label>
            <button
                className='btn btn-danger bg-transparent'
                type="sumbit"
                style={{ marginRight: 10, border: 'none', fontSize: 18 }}
            >
                🔍</button>
        </form>
    )
}

export default Search