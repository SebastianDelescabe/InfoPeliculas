import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { FiArrowUpRight, FiEye, FiEyeOff, FiFilm, FiLogIn } from 'react-icons/fi';
import { notify } from '../../helpers/notify';

// Credenciales compartidas para que cualquiera pueda probar esta demo local.
const DEMO_CREDENTIALS = {
    email: 'deleflix@delescabe.com.ar',
    password: 'react'
};

/** Pantalla de acceso visual; la validación es local y solo sirve para la demo. */
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
    const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
    const [showPassword, setShowPassword] = useState(false);
    const token = sessionStorage.getItem('token');

    // Evita que el scroll global de la app genere una barra en esta pantalla fija.
    useEffect(() => {
        const previousOverflowY = document.body.style.overflowY;
        document.body.style.overflowY = 'hidden';
        return () => { document.body.style.overflowY = previousOverflowY; };
    }, []);

    // Acepta el usuario demo y crea una sesión temporal en este navegador.
    const submitHandler = (event) => {
        event.preventDefault();
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
            notify('Usá las credenciales de demostración que aparecen en pantalla.', 'warning');
            return;
        }
        sessionStorage.setItem('token', nanoid());
        navigate('/home');
    };

    if (token) return <Navigate to='/home' replace />;

    return (
        <main className='login-wrap'>
            <section className='login-layout' aria-label='Inicio de sesión de Deleflix'>
                <div className='login-showcase'>
                    <Link className='login-brand' to='/login' aria-label='Deleflix, inicio'>DELE<span>FLIX</span></Link>
                    <div className='login-showcase-copy'>
                        <span className='login-eyebrow'><FiFilm aria-hidden='true' /> TU PRÓXIMA HISTORIA EMPIEZA ACÁ</span>
                        <h1>Menos buscar.<br /><span>Más disfrutar.</span></h1>
                        <p>Descubrí estrenos, explorá dónde verlos y armá tu propia lista para la próxima noche de películas.</p>
                    </div>
                    <div className='login-feature-row' aria-label='Funciones de Deleflix'>
                        <span><i /> Estrenos y cartelera</span>
                        <span><i /> Recomendaciones a tu gusto</span>
                        <span><i /> Tu lista, siempre a mano</span>
                    </div>
                    <div className='login-orbit login-orbit-one' />
                    <div className='login-orbit login-orbit-two' />
                </div>

                <div className='login-form-side'>
                    <div className='login-card'>
                        <div className='login-card-heading'>
                            <span className='login-card-icon'><FiLogIn aria-hidden='true' /></span>
                            <span className='login-eyebrow'>ACCESO DE PRUEBA</span>
                            <h2>¡Qué bueno verte!</h2>
                            <p>Ingresá con la cuenta pública para explorar la app.</p>
                        </div>

                        <form onSubmit={submitHandler}>
                            <label htmlFor='email'>Correo electrónico</label>
                            <input
                                className='form-control'
                                id='email'
                                type='email'
                                name='email'
                                autoComplete='username'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />

                            <label htmlFor='password'>Contraseña</label>
                            <div className='login-password-field'>
                                <input
                                    className='form-control'
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    autoComplete='current-password'
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <button
                                    className='login-password-toggle'
                                    type='button'
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? <FiEyeOff aria-hidden='true' /> : <FiEye aria-hidden='true' />}
                                </button>
                            </div>

                            <button className='btn login-submit' type='submit'>Entrar a Deleflix <FiArrowUpRight aria-hidden='true' /></button>
                        </form>

                        <div className='login-demo-credentials'>
                            <div><span className='login-demo-dot' /><strong>Credenciales públicas de demo</strong></div>
                            <p><span>Usuario</span><code>{DEMO_CREDENTIALS.email}</code></p>
                            <p><span>Contraseña</span><code>{DEMO_CREDENTIALS.password}</code></p>
                        </div>
                        <p className='login-disclaimer'>Cuenta compartida de prueba · los cambios se guardan en este navegador.</p>
                    </div>
                    <footer className='login-footer'>Explorá Deleflix <span>·</span> Proyecto de demostración</footer>
                </div>
            </section>
        </main>
    );
};

export default Login;
