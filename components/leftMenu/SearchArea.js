import React, { useEffect } from 'react';
import mapboxgl from '!mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import useMapStore from '../../stores/useMapStore';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoidGlzaGFzZWhkZXYwMiIsImEiOiJjazhsdDJtMWowZzRmM3JwZzh0M2FwZ3YxIn0.rXLGrb7GqFCtphNbQaVrbg';

function SearchArea({ className }) {
  const map = useMapStore((state) => state.map);

  useEffect(() => {
    if (!map) return;
    let geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search your location here...',
    });
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
    return () => {
      geocoder.onRemove(map)
    }
  }, []);

  return (
    <div className={`searchArea ${className}`} id='geocoder'>
    </div>
  );
}

export default SearchArea;
