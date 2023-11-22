import React, { useState } from 'react';
import useMapStore from '../../../stores/useMapStore';
import Image from 'next/image';

function TopControls() {
  const [mapStyle, setMapStyle] = useState('baseMapDark');
  const [isOpen, setIsOpen] = useState(false);
  const map = useMapStore((state) => state.map);

  const zoomIn = () => {
    let center = map.getBounds().getCenter();
    let zoom = map.getZoom() + 1;
    map.flyTo({ center: center, zoom: zoom });
  };

  const zoomOut = () => {
    let center = map.getBounds().getCenter();
    let zoom = map.getZoom() - 1;
    map.flyTo({ center: center, zoom: zoom });
  };

  const changeMap = (layerId, baseMapImg) => {
    map.setStyle('mapbox://styles/' + layerId);
    setMapStyle(baseMapImg);
  };

  return (
    <div className="fixed z-20 flex top-4 mt-[2px] right-24">
      <ul
        className={`absolute transition-all ease-in-out ${
          isOpen ? 'opacity-100 visible top-10' : 'invisible opacity-0 top-0'
        }`}
        onMouseLeave={() => setIsOpen(!isOpen)}
      >
        {mapStyle !== 'baseMapDark' && (
          <li
            className="relative w-10 h-10 mb-1 border rounded-md border-primary1"
            onClick={() =>
              changeMap(
                'tishasehdev02/claqfkgs7001u14nx5vqvf3kp',
                'baseMapDark',
              )
            }
          >
            <Image
              className="rounded-md"
              layout={'fill'}
              src={'/images/baseMapDark.png'}
              alt="Base map"
            />
          </li>
        )}
        {mapStyle !== 'baseMapRastor' && (
          <li
            className="relative w-10 h-10 mb-1 border rounded-md border-primary1"
            onClick={() => changeMap('mapbox/satellite-v9', 'baseMapRastor')}
          >
            <Image
              className="rounded-md"
              layout={'fill'}
              src={'/images/baseMapRastor.png'}
              alt="Base map"
            />
          </li>
        )}
        {mapStyle !== 'baseMapStreet' && (
          <li
            className="relative w-10 h-10 mb-1 border rounded-md border-primary1"
            onClick={() => changeMap('mapbox/streets-v11', 'baseMapStreet')}
          >
            <Image
              className="rounded-md"
              layout={'fill'}
              src={'/images/baseMapTerrain.png'}
              alt="Base map"
            />
          </li>
        )}
      </ul>
      <button
        className="relative w-8 h-8 mr-5 border border-primary1 rounded-md"
        onMouseOver={() => setIsOpen(!isOpen)}
      >
        <Image
          className="rounded-md"
          layout={'fill'}
          src={'/images/' + mapStyle + '.png'}
          alt="Base map"
        />
      </button>
      {/* {mapStyle ? (
        <button
          className="relative block w-8 h-8 mr-5"
          onClick={() => changeMap('mapbox/satellite-v9')}
        >
          <Image
            className="rounded-md"
            layout={'fill'}
            src={'/images/baseMapRastor.png'}
            alt="Base map"
          />
        </button>
      ) : (
        <button
          className="relative block w-8 h-8 mr-5"
          onClick={() => changeMap('tishasehdev02/claqfkgs7001u14nx5vqvf3kp')}
        >
          <Image
            className="rounded-md"
            layout={'fill'}
            src={'/images/baseMapDark.png'}
            alt="Base map"
          />
        </button>
      )} */}
      <div className="flex p-1 text-xl rounded-md bg-dark4/90 text-primary1">
        <span
          className="px-2 py-1 text-base border-r cursor-pointer icon-plus border-primary2"
          onClick={zoomIn}
        ></span>
        <span
          className="h-6 px-2 py-1 text-base cursor-pointer icon-minus"
          onClick={zoomOut}
        ></span>
      </div>
    </div>
  );
}

export default TopControls;
