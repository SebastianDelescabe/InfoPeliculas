import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Results, Login, Detail, Home, Header } from './components';
import 'animate.css';
import './app.css'

function App() {

  return (
    <div className='container mt-3'>
      <Header />
      <Routes >
        <Route exact path="/" element={<Login />} />
        <Route path="/listado" element={<Home />} />
        <Route path="/detalle" element={<Detail />} />
        <Route path="/resultados" element={<Results />} />
      </Routes >
    </div>
  );
}

export default App;


