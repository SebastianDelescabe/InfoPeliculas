import React from 'react'
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { Login, Header } from '../components';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import DashboardRoutes from './DashboardRoutes';
import Toasts from '../components/Toasts/Toasts';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

/** Define el router general y monta servicios globales de la aplicación. */
const AppShell = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div>
            {!isLoginPage && <Header />}
            <Routes>
                <Route path='/login' element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/*" element={
                    <PrivateRoute>
                        <DashboardRoutes />
                    </PrivateRoute>
                } />
            </Routes>
            <ScrollToTop />
            <Toasts />
        </div>
    )
}

const AppRouter = () => <BrowserRouter><AppShell /></BrowserRouter>;

export default AppRouter
