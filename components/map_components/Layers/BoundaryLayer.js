import React, { useEffect } from 'react';
import useMapStore from '../../../stores/useMapStore';

export const BoundaryLayer = ({
  data
}) => {
  const map = useMapStore((state) => state.map);

  useEffect(() => {
    if (!map) return;
    map.on('load', () => {

      map.addSource('boundary', {
      'type': 'geojson',
      data
      });
       
      map.addLayer(
      {
      'id': 'boundary',
      'type': 'fill',
      'source': 'boundary',
      'paint': {
      'fill-outline-color': 'rgba(255,252,127,1)',
      'fill-color': 'rgba(0,0,0,0)'
      }
      }
      );
    })

    return () => {
      map.removeLayer('counties');
    };
  }, [map]);
  return null;
};
