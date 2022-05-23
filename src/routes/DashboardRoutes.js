import React from "react";
import { Routes, Route } from "react-router-dom";

import {
    Results,
    Detail,
    Home,
    Favorites,
    Upcoming
} from '../components';


const DashboardRoutes = () => {
    return (
        <div className="container">
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="results" element={<Results />} />
                <Route path="detail" element={<Detail />} />
                <Route path="upcoming" element={<Upcoming />} />

            </Routes>
        </div>
    )
}

export default DashboardRoutes