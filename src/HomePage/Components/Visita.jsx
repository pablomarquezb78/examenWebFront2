import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from '../../SessionProvider';
import MapComponent from '../../maps/MapComponent';
import axios from 'axios';
import apiEndpoints from '../../assets/apiEndpoints.json';

function Acceso() {
    const navigate = useNavigate();
    const location = useLocation();  // Acceder a la ubicación actual
    const handleBack = () => navigate(-1);
    const handleNuevaUbicacion = () => navigate('/ubicacion');

    const { isLoggedIn } = useSession();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emailVisita, setEmailVisita] = useState("");

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmailVisita(location.state.email);
            fetchData();
        }
    }, [location]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const url = `${apiEndpoints.api}/mapas/?email=${emailVisita}`;
            const response = await axios.get(url);
            console.log(response);

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

    return (
        <>
            {isLoggedIn ? (
                <div className="h-min-screen p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
                    <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack} />
                    <h1 className="pt-4 text-3xl font-bold mb-2">Mapa de {location.state.email}</h1>
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
