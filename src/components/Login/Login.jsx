import swal from 'sweetalert'
import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom';
import { nanoid } from "nanoid";

const Login = () => {

    let navigate = useNavigate();

    const sumbitHandler = (e) => {
        e.preventDefault()

        const email = e.target.email.value;
        const password = e.target.password.value;

        const regexEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

        if (email === '' || password === '') {
            swal("", "Completar los campos", "warning");

            return; //para cortar ejecucion en una validación
        }

        if (email !== '' && !regexEmail.test(email)) {
            swal("", "Debe escribir un email valido", "warning");
            return
        }

        if (email !== 'deleflix@delescabe.com.ar' || password !== 'react') {
            swal("", "Credenciales invalidas", "warning");
            return
        }
        let token = nanoid();
        sessionStorage.setItem('token', token)
        return navigate('/home')
    }

    const token = sessionStorage.getItem('token');

    return (
        <>
            {token && <Navigate to='/home' />}
            <div className='col-6 offset-3 mt-5'>
                <h1 style={{ color: 'white' }}>Iniciar Sesión</h1>
                <form onSubmit={sumbitHandler}>
                    <label style={{ color: 'white' }} className='form-label d-block mt-2 pt-4'>
                        <span>Correo Electronico:</span><br />
                        <input
                            className='form-control'
                            type='text'
                            name="email"
                            value="deleflix@delescabe.com.ar"
                        />
                    </label>
                    <br />
                    <label style={{ color: 'white' }} className='form-label d-block mt-2 pt-2'>
                        <span>Contraseña:</span><br />
                        <input
                            type="password"
                            name="password"
                            className='form-control'
                        />
                    </label>
                    <label style={{ color: 'white' }} className='form-label d-block mt-2 pt-2'>Contraseña: react</label>
                    <br />
                    <button className='btn btn-success mt-2' type="sumbit">Ingresar</button>
                </form>
            </div>
        </>
    )
}

export default Login



