import axios from 'axios'
import Navbar from '../Common/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import {useEffect,useState} from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import apiEndpoints from '../assets/apiEndpoints.json'

import UploadFile from '../Common/UploadFile'
import {fetchCoordinates} from '../maps/CoordSearch'

function Update(){

    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data;

    const handleBack = () => {
        navigate(-1);
    };

    const [formState, setFormState] = useState({
        nombre: data?.nombre || "",
        lat: data?.lat || 0.0,
        lon: data?.lon || 0.0,
        organizador: data?.organizador || "",
        imagen: data?.imagen || "",
        lugar: data?.lugar || "",
        timestamp: data?.timestamp || ""
    });

    
    const handleEventSubmit = async (e) => {
    e.preventDefault();

    const coords = await fetchCoordinates(formState.lugar);
      if (coords) {
        formState.lat = coords.lat;
        formState.lon = coords.lon;
    }

    const updatedVersion = {
        nombre: formState.nombre,
        lat: parseFloat(formState.lat),
        lon: parseFloat(formState.lon),
        timestamp: formState.timestamp,
        organizador: "",
        imagen: formState.imagen,
        lugar: formState.lugar,
    };

    try {
        const response = await axios.put(
        apiEndpoints.api +"/eventos/" + data._id, updatedVersion, {
        headers: { "Content-Type": "application/json" },
        });
        setFormState((prevState) => ({
        ...prevState,
        nombre: "",
        lat: "",
        lon: "",
        }));
        setSubmitSuccess(true);
        } catch (err) {
        setSubmitSuccess(false);
        setSubmitError("Ocurrió un error al editar el evento.");
        }
    }

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const classnameboton = "bg-green-500 text-white mt-2 w-fit mx-auto px-4 py-2 rounded hover:bg-green-600 transition duration-200";

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    return (
        <>
            <div className='min-h-screen bg-gray-100 text-black p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white'>
                    <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
                    <h2 className='pt-4 text-3xl font-bold mb-2' >Creacion Evento</h2>
                        <form onSubmit={handleEventSubmit} className='flex flex-col'>
                            <label className="font-bold">Nombre</label>
                            <input
                            type="text"
                            name="nombre"
                            value={formState.nombre}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2  mr-3 bg-gray-300'
                            />
                            <label className="font-bold">Imagen</label>
                            <input
                            type="text"
                            name="imagen"
                            value={formState.imagen}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2  mr-3 bg-gray-300'
                            />
                            <label className="font-bold">Dirección Postal</label>
                            <input
                            type="text"
                            name="lugar"
                            value={formState.lugar}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2 mr-3 bg-gray-300'
                            />
                            <label className="font-bold">Fecha</label>
                            <input 
                            type="datetime-local"
                            name="timestamp"
                            value={formState.timestamp}
                            onChange={handleInputChange}
                            className='border rounded px-4 py-2 mr-3 bg-gray-300'
                            />
                            <UploadFile setFormState={setFormState}/>
                            <button type='submit' className={classnameboton}>Editar Evento</button>
                        </form>
                    {submitError && <p className="text-red-500">{submitError}</p>}
                    {submitSuccess && <p className="text-green-500">Entrada editada con éxito.</p>}
            </div>
        </>
    );
}

export default Update;