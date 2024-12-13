import {useEffect,useState} from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";
import '../CSS/HomePage.css'
import LogViewer from '../../Common/Log/LogViewer';

import Cookies from 'universal-cookie';
import { useSession } from '../../SessionProvider';
const cookies = new Cookies();

import axios from 'axios'


function HomePage(){
    const { isLoggedIn } = useSession();
    const navigate = useNavigate();

    const classnameboton = "bg-green-500 text-white mt-2 w-fit mx-auto px-4 py-2 rounded hover:bg-green-600 transition duration-200";

    const handleAcceso = () => {
      navigate('/acceso');
    };

    return(
    <div id='homeScreen' className='h-screen flex flex-col justify-between items-center'>

        <div className='flex flex-col justify-center items-center flex-grow gap-y-7'>
          <h1 id='titulo' className='text-center text-6xl font-sans font-bold italic tracking-wide'>MIMAPA</h1>
          {isLoggedIn ? (
            <>
              <button className={classnameboton} onClick={handleAcceso}>Acceso</button>
            </>
          ) : (
            <>
              <footer className='text-center text-2xl max-w-2xl mx-auto font-medium'>Debe iniciar sesión para acceder</footer>
            </>
          )}
        </div>
    </div>
    );

}

export default HomePage;