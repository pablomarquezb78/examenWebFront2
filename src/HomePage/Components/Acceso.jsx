import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from '../../SessionProvider';
import MapComponent from '../../maps/MapComponent';

import apiEndpoints from '../../assets/apiEndpoints.json';

function Acceso() {
    const navigate = useNavigate();
    const handleBack = () => navigate(-1);
    const handleNuevaUbicacion = () => navigate('/ubicacion');

    const { isLoggedIn, userEmail } = useSession();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const url = `${apiEndpoints.api}/mapas/?email=${userEmail}`;
            const response = await axios.get(url);

            if (response.data && response.data[0]) {
                setData(response.data[0]); 
            } else {
                setData(null); 
            }
        } catch (err) {
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false); 
        }
    };

    const classnameboton =
        "bg-green-500 text-white mt-2 w-fit mx-auto px-4 py-2 rounded hover:bg-green-600 transition duration-200 mb-4";

    // Renderizado condicional
    return (
        <>
            {isLoggedIn ? (
                <div className="h-min-screen p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
                    <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack} />
                    <h1 className="pt-4 text-3xl font-bold mb-2">Tu Mapa</h1>
                    <button className={classnameboton} onClick={handleNuevaUbicacion}>
                        Añade Ubicación
                    </button>
                    {loading ? (
                        <p>Cargando marcadores...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : data && data.marcadores && data.marcadores.length > 0 ? (
                        <>
                            <MapComponent coordinates={data.marcadores} />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {data.marcadores.map((marcador, index) => (
                                    marcador.imagen ? (
                                        <div key={index} className="border rounded shadow-md overflow-hidden">
                                            <img
                                                src={marcador.imagen}
                                                alt={`Imagen de ${marcador.nombre}`}
                                                className="w-full h-48 object-cover"
                                            />
                                            <p className="p-2 text-center font-medium">{marcador.nombre}</p>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>No se encontraron marcadores.</p>
                    )}
                </div>
            ) : (
                <footer className="text-center text-2xl max-w-2xl mx-auto font-medium">
                    Por favor inicie sesión.
                </footer>
            )}
        </>
    );
}

export default Acceso;
