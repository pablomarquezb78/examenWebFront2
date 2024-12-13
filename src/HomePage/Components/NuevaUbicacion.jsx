import React from 'react';
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import {useEffect,useState} from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from '../../SessionProvider';
import MapComponent from '../../maps/MapComponent'
import UploadFile from '../../Common/UploadFile';
import {fetchCoordinates} from '../../maps/CoordSearch'

import apiEndpoints from '../../assets/apiEndpoints.json'

function NuevaUbicacion(){

    const navigate = useNavigate();
        const handleBack = () => {
        navigate(-1);
    };

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formState, setFormState] = useState({
        imagen: "",
        ubicacion: "",
        lat: 0,
        lon: 0,
        });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();

        const coords = await fetchCoordinates(formState.ubicacion);
        if (coords) {
            formState.lat = coords.lat;
            formState.lon = coords.lon;
        }

        try {
            const response = await axios.get(apiEndpoints.api + "/mapas?email=" + userEmail);
            const existingMapa = response.data[0];

            const updatedMarcadores = [...existingMapa.marcadores, { lat: formState.lat, lon: formState.lon, 
                nombre: formState.ubicacion, imagen: formState.imagen}];

            await axios.put(apiEndpoints.api + "/mapas/" + existingMapa._id, {
                ...existingMapa,
                marcadores: updatedMarcadores,
            }, {
                headers: { "Content-Type": "application/json" },
            });

            setFormState((prevState) => ({
                ...prevState,
                lat: "",
                lon: "",
                ubicacion: "",
            }));
            setSubmitSuccess(true);
            } catch (err) {
            setSubmitSuccess(false);
            setSubmitError("Ocurrió un error al crear la ubicacion." + err);
        }
    }

    const { isLoggedIn, userEmail } = useSession();

    const classnameboton = "bg-green-500 text-white mt-2 w-fit mx-auto px-4 py-2 rounded hover:bg-green-600 transition duration-200 mb-4";

    return (
    <>
    {isLoggedIn ? (
            <div className='h-min-screen p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white'>
            <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
            <h1 className="pt-4 text-3xl font-bold mb-2">Tu Mapa</h1>
            <p className='pt-4 text-xl font-bold mb-2 my-2'>Añade Ubicaciones:</p>
            <form onSubmit={handleEventSubmit} className='flex flex-col'>
                <label className="font-bold">Ubicación</label>
                <input
                type="text"
                name="ubicacion"
                value={formState.ubicacion}
                onChange={handleInputChange}
                className='border rounded px-4 py-2 mr-3 bg-gray-300'
                />
                <UploadFile setFormState={setFormState}/>
                <button type='submit' className={classnameboton}>Añadir Ubicación</button>
            </form>
            {submitError && <p className="text-red-500">{submitError}</p>}
            {submitSuccess && <p className="text-green-500">Ubicacion creada con éxito.</p>}
        </div>
      ) : (
        <footer className='text-center text-2xl max-w-2xl mx-auto font-medium'>Por favor inicie sesión.</footer>
      )}
    </>
    );
}

export default NuevaUbicacion