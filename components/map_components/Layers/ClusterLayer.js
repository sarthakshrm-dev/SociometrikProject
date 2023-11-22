import React, { useEffect } from 'react';
import useMapStore from '../../../stores/useMapStore';

export const ClusterLayer = ({
  type,
  paint,
  id,
  visibility,
  source,
  filter,
  layout,
}) => {
  const map = useMapStore((state) => state.map);

  useEffect(() => {
    if (!map) return;
    map.on('load', manageSources);
    map.on('styledata', manageSources);

    return () => {
      map.removeLayer(id);
    };
  }, [map]);

  const manageSources = () => {
    if (!map) return;
    const isAdded = map.getLayer(id) ? true : false;
    if (!isAdded) {
      map.addLayer({
        id,
        type,
        source,
        filter,
        paint,
        layout,
      });
      map.setLayoutProperty(id, 'visibility', visibility);

      map.on('click', id, (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [id],
        });
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource(source)
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });
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
