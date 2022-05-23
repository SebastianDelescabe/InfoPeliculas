import { Navigate } from "react-router-dom";


const PublicRoute = ({ children }) => {

    const token = sessionStorage.getItem('token')

    return token
        ? <Navigate to='/home' />
        : children
}

export default PublicRoute