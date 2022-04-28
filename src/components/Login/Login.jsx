import axios from 'axios'
import swal from 'sweetalert'
import React from 'react'
import { useNavigate,Navigate } from 'react-router-dom'

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

        if (email !== 'challenge@alkemy.org' || password !== 'react') {
            swal("", "Credenciales invalidas", "warning");
            return
        }

        // axios.post('url del endopoint','{objeto que la api espera')
        axios.post('http://challenge-react.alkemy.org', { email, password })
            .then(response => {
                swal("Buen trabajo", "Ingresaste Correctamente", "success");
                const token = response.data.token;
                sessionStorage.setItem('token', token) //Lo que guardas en el session storage y como lo guardas.. Solo guarda STRINGS HACERLE STRINGIFY
                sessionStorage.setItem('Nombre', 'Sebastian Delescabe') //Lo que guardas en el session storage y como lo guardas.. Solo guarda STRINGS HACERLE STRINGIFY
                return navigate('/listado')

                //const newToken = sessionStorage.getItem('token') //Asi traigo info del session storage
            });
    }

    const token = sessionStorage.getItem('token');

    return (
        <>
         {token && <Navigate to='/listado' />}
            <div className='col-6 offset-3 mt-5'>
                <h1>Formulario Login</h1>
                <form onSubmit={sumbitHandler}>
                    <label className='form-label d-block mt-2'>
                        <span>Correo Electronico:</span><br />
                        <input className='form-control' type='text' name="email" />
                    </label>
                    <br />
                    <label className='form-label d-block mt-2'>
                        <span>Contraseña:</span><br />
                        <input type="password" name="password" className='form-control' />
                    </label>
                    <br />
                    <button className='btn btn-success mt-2' type="sumbit">Ingresar</button>
                </form>
            </div>
        </>
    )
}

export default Login