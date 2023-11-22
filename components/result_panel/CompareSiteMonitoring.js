import React, { useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import ReSmallMap from '../map_components/Map/ReSmallMap';
import useMapStore from '../../stores/useMapStore';
import RightMenu from '../map_components/mapControls/RightMenu';
import style from './Result.module.css';
import * as turf from '@turf/turf';
import getConfig from 'next/config';
// import IndicatorItem from './IndicatorItem';
import Indicator from './Indicator';
import FootfallIndicator from './FootfallIndicator';
import PoiIndicator from './PoiIndicator';
import CSIndicator from './CSIndicator';
import TradeArea from './TradeArea';
const { publicRuntimeConfig } = getConfig();

function CompareSiteMonitoring({
  locations,
  features,
  selectedMarket,
  isOpen,
  closeCompare,
}) {
  const map = useMapStore((state) => state.smallMap);
  const [popup, setPopup] = useState(null);
  const [socioeconomic, setSocioeconomic] = useState([]);
  const [demography, setDemography] = useState([]);
  const [customerSegmentation, setCustomerSegmentation] = useState([]);
  const [poi, setPoi] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [digitalPenetration, setDigitalPenetration] = useState([]);

  useEffect(() => {
    setPopup(
      new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      }),
    );
  }, []);

  useEffect(() => {
    if (!map) return;
    map.once('load', () => {
      map.addSource('highlights', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: locations,
        },
      });
      map.addLayer({
        id: 'highlights',
        type: 'fill',
        source: 'highlights',
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-outline-color': 'rgba(255, 255, 255, 1)',
          'fill-color': 'rgba(255, 234, 0, 0.75)',
        },
      });

      //   map.getCanvas().style.cursor = 'pointer';
      //   const feature = e.features[0];
      //   let content = '';
      //   Object.keys(feature.properties).forEach((x) => {
      //     try {
      //       var value =
      //         typeof feature.properties[x] === 'string' ||
      //         feature.properties[x] instanceof String
      //           ? feature.properties[x]
      //           : parseFloat(feature.properties[x].toFixed(2)).toLocaleString();
      //       content +=
      //         capitalizeFirstLetter(x.replaceAll('_', ' ')) +
      //         ': ' +
      //         value +
      //         '<br>';
      //     } catch (e) {
      //       // debugger
      //     }
      //   });
      //   const coordinates = e.lngLat;
      //   popup.setLngLat(coordinates).setHTML(content).addTo(map);
      // });
      map.on(
        'mouseenter',
        'highlights',
        () => (map.getCanvas().style.cursor = 'pointer'),
      );
      map.on('mouseleave', 'highlights', () => {
        map.getCanvas().style.cursor = '';
        // popup.remove();
      });
    });
    // map.once('idle', () => {
    //   let bbox = turf.bbox({
    //     type: 'FeatureCollection',
    //     features: locations,
    //   });
    //   map.fitBounds(bbox, {
    //     padding: 20,
    //   });
    // });
  }, [map]);



  return (
    <div
      className={`fixed inset-0 px-10 bg-dark2 py-8 2xl:py-14 transition-all ${
        isOpen ? 'opacity-100 z-20 visible' : 'opacity-0 invisible -z-10'
      }`}
    >
      <div className="grid items-center grid-cols-3">
        <div className="text-center">
          <button
            className="flex items-center text-primary1"
            onClick={closeCompare}
          >
            <span className="mr-1 icon-back-arrow"></span> Back to main view{' '}
          </button>
        </div>
        <h2 className="text-lg font-medium text-center">Compare Trade Area</h2>
        <div className="relative">
          <div className="absolute right-0 z-10 -top-4">
            <RightMenu />
          </div>
        </div>
      </div>
      <div className="grid h-full grid-cols-12 gap-10 pt-8 2xl:pt-12">
        <div className="relative col-span-9 2xl:col-span-8">
          
          <div className="absolute inset-x-0 pr-2 overflow-auto top-3 2xl:top-6 bottom-4">
            <TradeArea areaTitle="Tade area 1" />
            <TradeArea areaTitle="Tade area 2" />
            <TradeArea areaTitle="Tade area 3" />
          </div>
        </div>
        <div className="relative col-span-3 overflow-hidden rounded-lg shadow-lg 2xl:col-span-4">
          <ReSmallMap center={[78.626598, 22.838084]} zoom={4} />
        </div>
      </div>
    </div>
  );
}

export default CompareSiteMonitoring;
