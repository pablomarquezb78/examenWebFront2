import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css'

import HomePage from './HomePage/Components/HomePage';
import Navbar from './Common/NavBar';
import Acceso from './HomePage/Components/Acceso';
import NuevaUbicacion from './HomePage/Components/NuevaUbicacion';
import Visita from './HomePage/Components/Visita'
import keys from '../keys.json'

import { SessionProvider } from './SessionProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={keys.GoogleClientID}>
    <SessionProvider> 
      <Router>
        <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path='/acceso' element={<Acceso/>}/>
            <Route path='/ubicacion' element={<NuevaUbicacion/>}/>
            <Route path='/visita' element={<Visita/>}/>
          </Routes>
      </Router>
    </SessionProvider>
  </GoogleOAuthProvider>

)
