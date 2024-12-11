import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import {fetchCoordinates} from '../maps/CoordSearch'

const SearchBar = () => {
  const [formState, setFormState] = useState({
    direccion: "",
    organizador: "",
    nombre: "",
  });

  const classnameboton = "bg-green-500 text-white w-fit mt-4 px-4 py-2 rounded hover:bg-green-600 transition duration-200";

  const navigate = useNavigate();

  const search = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (formState.direccion.trim()) {
      const coords = await fetchCoordinates(formState.direccion);
      if (coords) {
        params.append("lat", parseFloat(coords.lat));
        params.append("lon", parseFloat(coords.lon));
      }
    }

    if(formState.nombre.trim()){
      params.append("nombre",formState.nombre);
    }

    if(formState.organizador.trim()){
      params.append("organizador",formState.organizador);
    }

    navigate(`/eventos?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={search} className='flex gap-3 justify-center'>
      <div className='flex flex-col'>
        <label className="font-bold">Nombre Evento</label>
        <input
          type="text"
          name='nombre'
          placeholder="Buscar..."
          value={formState.nombre}
          onChange={handleInputChange}
          className='border rounded px-4 py-2  mr-3 bg-gray-300'
        />
        <label className="font-bold">Organizador</label>
        <input
          type="text"
          name='organizador'
          placeholder="Buscar..."
          value={formState.organizador}
          onChange={handleInputChange}
          className='border rounded px-4 py-2  mr-3 bg-gray-300'
        />
        <label className="font-bold">Dirección Postal</label>
        <input
          type="text"
          name='direccion'
          placeholder="Nombre o dirección"
          value={formState.direccion}
          onChange={handleInputChange}
          className='border rounded px-4 py-2  mr-3 bg-gray-300'
        />
        <button type='submit' className={classnameboton} > Buscar </button>
      </div>
    </form>
  );
};

export default SearchBar;