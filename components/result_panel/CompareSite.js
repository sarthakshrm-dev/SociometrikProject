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
const { publicRuntimeConfig } = getConfig();

function CompareSite({
  locations,
  features,
  selectedMarket,
  isOpen,
  closeCompare,
}) {
  const map = useMapStore((state) => state.smallMap);
  const [popup, setPopup] = useState(null);
  const [isActive, setIsActive] = useState('Socioeconomic');
  const [socioeconomic, setSocioeconomic] = useState([]);
  const [demography, setDemography] = useState([]);
  const [customerSegmentation, setCustomerSegmentation] = useState([]);
  const [poi, setPoi] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [digitalPenetration, setDigitalPenetration] = useState([]);

  useEffect(() => {
    getBroadCategories();
  }, []);

  useEffect(() => {
    if (!map) return;
    setPopup(
      new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      }),
    );
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

      map.on('mousemove', 'highlights', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const feature = e.features[0];
        let content = '';
        Object.keys(feature.properties).forEach((x) => {
          try {
            var value =
              typeof feature.properties[x] === 'string' ||
              feature.properties[x] instanceof String
                ? feature.properties[x]
                : parseFloat(feature.properties[x].toFixed(2)).toLocaleString();
            content +=
              capitalizeFirstLetter(x.replaceAll('_', ' ')) +
              ': ' +
              value +
              '<br>';
          } catch (e) {
            // debugger
          }
        });
        const coordinates = e.lngLat;
        // popup.setLngLat(coordinates).setHTML(content).addTo(map);
      });
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
    map.once('idle', () => {
      let bbox = turf.bbox({
        type: 'FeatureCollection',
        features: locations,
      });
      map.fitBounds(bbox, {
        padding: 20,
      });
    });
  }, [map]);

  const getBroadCategories = async () => {
    let resSocioeconomic = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/socioeconomic',
    );
    setSocioeconomic(await resSocioeconomic.json());

    let resDemography = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/demography',
    );
    setDemography(await resDemography.json());

    let resCS = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/customer-segmentation',
    );
    setCustomerSegmentation(await resCS.json());

    let resPoi = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/poi',
    );
    setPoi(await resPoi.json());

    let resInfrastructure = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/infrastructure',
    );
    setInfrastructure(await resInfrastructure.json());

    let resDp = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/digital-penetration',
    );
    setDigitalPenetration(await resDp.json());
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const highlightOnMap = (loc) => {
    console.log(loc)
  }

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
        <h2 className="text-lg font-medium text-center">Compare Site</h2>
        <div className="relative">
          <div className="absolute right-0 z-10 -top-4">
            <RightMenu />
          </div>
        </div>
      </div>
      <div className="grid h-full grid-cols-12 gap-10 pt-8 2xl:pt-12">
        <div className="relative col-span-9 2xl:col-span-8">
          <ul className="flex items-center mb-4">
            <li
              className={`${style.tabBtn}  ${
                isActive === 'Socioeconomic' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('Socioeconomic')}
            >
              Socioeconomic
            </li>
            <li
              className={`${style.tabBtn}  ${
                isActive === 'Demography' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('Demography')}
            >
              Demography
            </li>
            <li
              className={`${style.tabBtn}  ${
                isActive === 'CustomerSegmentation' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('CustomerSegmentation')}
            >
              Customer Segmentation
            </li>
            <li
              className={`${style.tabBtn}  ${
                isActive === 'PointsOfInterest' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('PointsOfInterest')}
            >
              Points of Interest
            </li>
            <li
              className={`${style.tabBtn}  ${
                isActive === 'Infrastructure' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('Infrastructure')}
            >
              Infrastructure
            </li>
            <li
              className={`${style.tabBtn}  ${
                isActive === 'DigitalPenetration' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('DigitalPenetration')}
            >
              Digital Penetration
            </li>
            <li
              className={`${style.tabBtn}  ${
                isActive === 'Footfall' ? style.tabBtnActive : ''
              }`}
              onClick={() => setIsActive('Footfall')}
            >
              Footfall
            </li>
          </ul>
          <div className="absolute inset-x-0 pr-2 overflow-auto top-10 2xl:top-20 bottom-4">
            {isActive === 'Socioeconomic' && socioeconomic.length > 0 && (
              <Indicator
                indc={socioeconomic}
                locations={locations}
                selectedMarket={selectedMarket}
                hoverLocation= {(location) => highlightOnMap(location)}
              />
            )}
            {isActive === 'Demography' && demography.length > 0 && (
              <Indicator
                indc={demography}
                locations={locations}
                selectedMarket={selectedMarket}
                hoverLocation= {(location) => highlightOnMap(location)}
              />
            )}
            {isActive === 'Infrastructure' && infrastructure.length > 0 && (
              <Indicator
                indc={infrastructure}
                locations={locations}
                selectedMarket={selectedMarket}
                hoverLocation= {(location) => highlightOnMap(location)}
              />
            )}
            {isActive === 'DigitalPenetration' &&
              digitalPenetration.length > 0 && (
                <Indicator
                  indc={digitalPenetration}
                  locations={locations}
                  selectedMarket={selectedMarket}
                  hoverLocation= {(location) => highlightOnMap(location)}
                />
              )}
            {isActive === 'CustomerSegmentation' &&
              customerSegmentation.length > 0 && (
                <CSIndicator
                  indc={customerSegmentation}
                  locations={locations}
                  selectedMarket={selectedMarket}
                />
              )}
            {isActive === 'PointsOfInterest' && poi.length > 0 && (
              <PoiIndicator
                indc={poi}
                locations={locations}
                selectedMarket={selectedMarket}
              />
            )}
            {isActive === 'Footfall' && (
              <FootfallIndicator
                locations={locations}
                selectedMarket={selectedMarket}
              />
            )}
          </div>
        </div>
        <div className="relative col-span-3 rounded-lg 2xl:col-span-4">
          <ReSmallMap center={[78.626598, 22.838084]} zoom={4} />
        </div>
      </div>
    </div>
  );
}

export default CompareSite;
