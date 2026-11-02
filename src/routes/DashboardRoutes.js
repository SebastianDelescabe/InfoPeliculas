import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import {
    Results,
    Detail,
    Home,
    Favorites,
    Upcoming
} from '../components';


/** Agrupa las pantallas privadas y adapta el ancho del inicio. */
const DashboardRoutes = () => {
    const location = useLocation();
    const isHome = location.pathname === '/home';

    return (
        <main className={`page-container${isHome ? ' home-page-container' : ''}`}>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="results" element={<Results />} />
                <Route path="detail" element={<Detail />} />
                <Route path="upcoming" element={<Upcoming />} />

            </Routes>
        </main>
    )
}

export default DashboardRoutes
