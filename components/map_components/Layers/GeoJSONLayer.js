import React, { useEffect } from 'react';
import useMapStore from '../../../stores/useMapStore';

export const GeoJSONLayer = ({
  source,
  data,
  type,
  paint,
  layout,
  id,
  visibility,
  cluster,
  clusterMaxZoom,
  clusterRadius,
  filter,
}) => {
  const map = useMapStore((state) => state.map);

  useEffect(() => {
    if (!map) return;
    map.on('load', manageLayers);
    map.on('styledata', manageLayers);
    map.on('styleimagemissing', (e) => {
      const id = e.id; // id of the missing image
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.addImage(id, image);
        },
      );
    });

    return () => {
      map.removeLayer(id);
    };
  }, [map]);

  const manageLayers = () => {
    if (!map) return;
    const isAdded = map.getLayer(id) ? true : false;
    if (!isAdded) {
      if (cluster) {
        map.addSource(id, {
          type: 'geojson',
          data,
          cluster,
          clusterMaxZoom,
          clusterRadius,
        });
      } else {
        if (!source) {
          map.addSource(id, {
            type: 'geojson',
            data,
          });
        }
      }

      map.addLayer({
        id,
        type,
        source: source ? source : id,
        layout,
        paint,
      });

      if (filter) {
        map.setFilter(id, filter);
      }

      map.setLayoutProperty(id, 'visibility', visibility);

      map.on('mouseenter', id, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', id, () => {
        map.getCanvas().style.cursor = '';
      });
    }
  };

  return null;
};
