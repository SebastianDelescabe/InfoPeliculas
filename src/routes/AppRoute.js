import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login, Header } from '../components';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import DashboardRoutes from './DashboardRoutes';
import Toasts from '../components/Toasts/Toasts';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div>
                <Header />
                <Routes>
                    <Route path='/login' element=
                        {
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route path="/*" element=
                        {
                            <PrivateRoute>
                                <DashboardRoutes />
                            </PrivateRoute>
                        }
                    />
                </Routes>
                <ScrollToTop />
                <Toasts />
            </div>
        </BrowserRouter>
    )
}

export default AppRouter
