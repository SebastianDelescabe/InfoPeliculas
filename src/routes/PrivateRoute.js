import { Navigate } from "react-router-dom";

/** Restringe las rutas privadas a una sesión activa. */
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to='/login' replace />;
};

export default PrivateRoute
