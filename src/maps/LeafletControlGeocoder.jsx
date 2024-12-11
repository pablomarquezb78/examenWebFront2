import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

function LeafletControlGeocoder({setCoordinates = null}) {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();

    // Crear el control de geocodificación
    const control = L.Control.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder,
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;
        const icon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Icono predeterminado
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        if (typeof setCoordinates === 'function') {
          setCoordinates({
            lat: latlng.lat,
            lon: latlng.lng,
          });
        }

        // Añadir un marcador en la ubicación seleccionada
        L.marker(latlng, { icon })
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();

        // Cambiar la vista del mapa para centrar la búsqueda
        map.setView(latlng, map.getZoom(), { animate: true });
      })
      .addTo(map);


    // Limpiar el control cuando el componente se desmonte
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}

export default LeafletControlGeocoder;
