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
            <main className='login-page'>
            <div className='login-card'>
                <h1>Iniciar sesión</h1>
                <p>Ingresá para explorar películas y guardar tus favoritas.</p>
                <form onSubmit={sumbitHandler}>
                    <label className='form-label'>
                        <span>Correo Electronico:</span><br />
                        <input
                            className='form-control'
                            type='text'
                            name="email"
                            value="deleflix@delescabe.com.ar"
                        />
                    </label>
                    <br />
                    <label className='form-label'>
                        <span>Contraseña:</span><br />
                        <input
                            type="password"
                            name="password"
                            className='form-control'
                            value="react"
                        />
                    </label>
                    <br />
                    <button className='btn btn-success' type="submit">Ingresar</button>
                </form>
                <p className='login-hint'>Demo: deleflix@delescabe.com.ar · contraseña: react</p>
            </div>
            </main>
        </>
    )
}

export default Login



