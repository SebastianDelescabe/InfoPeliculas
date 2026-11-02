import { Navigate } from "react-router-dom";


/** Evita mostrar el acceso si ya existe una sesión iniciada. */
const PublicRoute = ({ children }) => {

    const token = sessionStorage.getItem('token')

    return token
        ? <Navigate to='/home' />
        : children
}

export default PublicRoute
