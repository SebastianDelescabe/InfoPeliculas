import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { notify } from '../../helpers/notify';

const Login = () => {
    const navigate = useNavigate();
    const submitHandler = (event) => {
        event.preventDefault();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email || !password) return notify('Completá los campos', 'warning');
        if (!regexEmail.test(email)) return notify('Escribí un email válido', 'warning');
        if (email !== 'deleflix@delescabe.com.ar' || password !== 'react') return notify('Credenciales inválidas', 'warning');
        sessionStorage.setItem('token', nanoid());
        navigate('/home');
    };

    const token = sessionStorage.getItem('token');
    return <>
        {token && <Navigate to='/home' replace />}
        <div className='login-wrap'>
            <section className='login-card'>
                <h1>Te damos la bienvenida</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor='email'>Correo electrónico</label>
                    <input className='form-control' id='email' type='email' name='email' placeholder='nombre@correo.com' autoComplete='username' />
                    <label htmlFor='password'>Contraseña</label>
                    <input className='form-control' id='password' type='password' name='password' placeholder='Tu contraseña' autoComplete='current-password' />
                    <button className='btn' type='submit'>Iniciar sesión</button>
                    <p className='login-hint'>Demo: deleflix@delescabe.com.ar · react</p>
                </form>
            </section>
        </div>
    </>;
};

export default Login;
