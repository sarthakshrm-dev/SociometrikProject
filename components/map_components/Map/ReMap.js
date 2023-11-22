import React, { useRef, useEffect, useState } from 'react';
import useMapStore from '../../../stores/useMapStore';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoidGlzaGFzZWhkZXYwMiIsImEiOiJjazhsdDJtMWowZzRmM3JwZzh0M2FwZ3YxIn0.rXLGrb7GqFCtphNbQaVrbg';

const ReMap = ({ children, center, zoom }) => {
  const mapRef = useRef();
  const map = useMapStore((state) => state.map);
  const setMap = useMapStore((state) => state.populateMap);
  const destroyMap = useMapStore((state) => state.removeMap);

  // create map
  useEffect(() => {
    if (map) return;
    let mapObjs = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/tishasehdev02/claqfkgs7001u14nx5vqvf3kp',
      center,
      zoom,
      preserveDrawingBuffer: true,
    });
    setMap(mapObjs);
    return () => {
      destroyMap();
    };
  }, []);

  return (
    <div ref={mapRef} className="!absolute inset-0">
      {children}
    </div>
  );
};

export default ReMap;
