import React, { useEffect, useRef, useState } from 'react';
import useMapStore from '../../../stores/useMapStore';
import mapboxgl from '!mapbox-gl';
import * as turf from '@turf/turf';
import getConfig from 'next/config';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../components/Loader';
import RecentLocations from './RecentLocations';
import globalStore from '../../../stores/global';
const { publicRuntimeConfig } = getConfig();
var XLSX = require('xlsx');

function RightMenu({ setUpload }) {
  const {
    uploadIsOpen,
    setUploadIsOpen,
    catchmentIsOpen,
    setCatchmentIsOpen,
    tradeArea,
    setTradeArea,
  } = globalStore((state) => state);
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeOption, setActiveOption] = useState('');
  // const [radius, setRadius] = useState(0);
  // const [target, setTarget] = useState({});
  const map = useMapStore((state) => state.map);
  const [popup, setPopup] = useState(null);
  const [iframeContent, setIframeContent] = useState('');
  const [file, setFile] = useState();
  const [uploadType, setUploadType] = useState('Location');
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [notification, setNotification] = useState(false);
  const [addresses, setAddresses] = useState({});
  const uploadRef = useRef();
  const formRef = useState();

  useEffect(() => {
    if (uploadIsOpen || catchmentIsOpen) {
      if (uploadIsOpen) {
        setActiveOption('upload');
        setCatchmentIsOpen(false);
      }
      if (catchmentIsOpen) {
        setActiveOption('Trade Area');
        setUploadIsOpen(false);
      }
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setActiveOption('');
    }
  }, [uploadIsOpen, catchmentIsOpen]);

  useEffect(() => {
    setPopup(
      new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      }),
    );
    setActiveOption('Identity Tool');
  }, []);

  useEffect(() => {
    if (file) {
      const xl2json = new ExcelToJSON();
      xl2json.parseExcel(file);
    }
  }, [file]);

  useEffect(() => {
    if (tradeArea) {
      let radius = tradeArea / 1000;
      map.setLayoutProperty('uploads', 'visibility', 'none');
      map.setLayoutProperty('uploads-clusters', 'visibility', 'none');
      map.setLayoutProperty('uploads-cluster-count', 'visibility', 'none');
      map.setLayoutProperty('uploads-unclusters', 'visibility', 'visible');
      let uploads = map.getSource('uploads-unclusters')._data.features;
      if (uploads.length > 0) {
        let fc = {
          type: 'FeatureCollection',
          features: [],
        };
        uploads.forEach((x) => {
          try {
            const circle = turf.circle(x, radius, { units: 'kilometers' });
            fc.features.push(circle);
          } catch (e) {
            // console(e);
          }
        });
        map.getSource('catchment').setData(fc);
      }
    }
  }, [tradeArea]);

  const ExcelToJSON = function () {
    this.parseExcel = function (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setLoading(true);
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: 'binary',
        });
        let fc = {
          type: 'FeatureCollection',
          features: [],
        };
        let total_addresses = 0,
          array = [];
        workbook.SheetNames.forEach((sheetName) => {
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName],
          );
          total_addresses += XL_row_object.length;
          XL_row_object.map((x) => {
            if (x.Longitude && x.Latitude) {
              fc.features.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [x.Longitude, x.Latitude],
                },
                properties: x,
              });
            } else if (x.Address) {
              array.push(x);
            }
          });
        });
        if (array.length > 0) {
          getMapsAddress(array).then((data) => {
            data.forEach((x) => fc.features.push(x));
            setAddresses({
              total: total_addresses,
              passed: fc.features.length,
            });
            map.getSource('uploads').setData(fc);
            map.getSource('uploads-unclusters').setData(fc);
            var bbox = turf.bbox(fc);
            map.fitBounds(bbox, {
              padding: 20,
            });
            resetUpload();
          });
        } else {
          setAddresses({
            total: total_addresses,
            passed: fc.features.length,
          });
          map.getSource('uploads').setData(fc);
          map.getSource('uploads-unclusters').setData(fc);
          var bbox = turf.bbox(fc);
          map.fitBounds(bbox, {
            padding: 20,
          });
          resetUpload();
        }
      };

      reader.onerror = (ex) => {
        setUploadError(ex);
        resetUpload();
      };

      reader.readAsBinaryString(file);
    };
  };

  const getMapsAddress = async (data) => {
    let features = [];
    for (var key in data) {
      const dt = await (
        await fetch(
          'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            data[key]['Address'] +
            '&key=AIzaSyBWo8FV_HIl7DbRYH8LfmA_Uh53NOYSNmg',
        )
      ).json();
      if (dt.status === 'OK') {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              dt.results[0].geometry.lng,
              dt.results[0].geometry.lat,
            ],
          },
          properties: data[key],
        });
      }
    }
    return features;
  };

  const resetUpload = () => {
    setLoading(false);
    setNotification(true);
    setUpload(true);
    setTimeout(() => {
      uploadRef.current?.classList.add('fade');
      setTimeout(() => {
        setActiveOption('');
        uploadRef.current?.classList.remove('fade');
      }, 1000);
    }, 2000);
    setFile(null);
  };

  const identify = (e) => {
    const feature = map
      .queryRenderedFeatures(e.point)
      .find((x) =>
        ['heatmap', 'bubbles', 'pointPOIs', 'hexgrids', 'uploads'].includes(
          x.layer.id,
        ),
      );
    if (feature) {
      let properties = feature.properties;
      if (properties) {
        let content = '';
        Object.keys(properties).forEach((x) => {
          if (
            ![
              'stat_cd',
              'dist_cd',
              'villsage_cd',
              'town_cd',
              'locality_id',
              'hexid08',
              'id',
              'geo_id',
              'indicator_id',
              'locality_id',
              'top100',
              'center',
              'smtii0001'
            ].includes(x)
          ) {
            try {
              var value =
                typeof properties[x] === 'string' ||
                properties[x] instanceof String
                  ? properties[x]
                  : parseFloat(properties[x].toFixed(2)).toLocaleString();
              content +=
                capitalizeFirstLetter(x.replaceAll('_', ' ')) +
                ': ' +
                value +
                '<br>';
            } catch (e) {
              // debugger
            }
          }
        });
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      } else {
        popup.remove();
      }
    } else {
      popup.remove();
    }
  };

  const identifyenter = (e) => (map.getCanvas().style.cursor = 'pointer');

  const identifyleave = (e) => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const bookmark = (e) => {
    const coordinates = e.lngLat;
    storeBookmark(coordinates);
  };

  useEffect(() => {
    if (!map) return;
    if (activeOption == 'Identity Tool') {
      map.on('mousemove', identify);
      map.on('mouseenter', identifyenter);
      map.on('mouseleave', identifyleave);
    } else if (activeOption == 'Drop a pin') {
      map.on('click', bookmark);
    }
    return () => {
      map.off('mousemove', identify);
      map.off('mouseenter', identifyenter);
      map.off('mouseleave', identifyleave);
      map.off('click', bookmark);
    };
  }, [activeOption]);

  const storeBookmark = async (coordinates) => {
    setLoader(true);
    const myBookmarks = await (
      await fetch(publicRuntimeConfig.API_ROOT_URL + 'my/bookmarks/')
    ).json();
    if (myBookmarks.length == 100) {
      await fetch(
        publicRuntimeConfig.API_ROOT_URL + `bookmarks/${myBookmarks[0].id}`,
        {
          method: 'DELETE',
        },
      );
    }
    const bound = map.getBounds();
    const bbox = [bound._sw.lng, bound._sw.lat, bound._ne.lng, bound._ne.lat];
    const place = await (
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lng}`,
      )
    ).json();
    const res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'bookmarks/', {
      method: 'POST',
      body: JSON.stringify({
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        extent: bound,
        image: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/[${bbox}]/1000x600@2x?access_token=pk.eyJ1IjoidGlzaGFzZWhkZXYwMiIsImEiOiJjazhsdDJtMWowZzRmM3JwZzh0M2FwZ3YxIn0.rXLGrb7GqFCtphNbQaVrbg`,
        zoom: map.getZoom(),
        address: place.address,
      }),
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
    });
    setLoader(false);
    if (res.ok) {
      toast.success('Location is saved.');
    }
  };

  const zoomToIndia = () => {
    map.flyTo({ center: [78.626598, 22.838084], zoom: 4 });
  };

  const makePNG = () => {
    var anchor = document.createElement('a');
    anchor.href = map.getCanvas().toDataURL('image/jpeg');
    anchor.download = 'map.jpg';
    anchor.click();
  };

  const makeIframe = () => {
    showControl('Share Map');
    const bound = map.getBounds();
    const bbox = [bound._sw.lng, bound._sw.lat, bound._ne.lng, bound._ne.lat];
    setIframeContent(
      "<iframe width='1000px' height='600px'><img src='" +
        `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/[${bbox}]/1000x600@2x?access_token=pk.eyJ1IjoidGlzaGFzZWhkZXYwMiIsImEiOiJjazhsdDJtMWowZzRmM3JwZzh0M2FwZ3YxIn0.rXLGrb7GqFCtphNbQaVrbg` +
        "'></iframe>",
    );
  };

  const showControl = (tool) => {
    popup.remove();
    map.getSource('catchment').setData({
      type: 'FeatureCollection',
      features: [],
    });
    if (activeOption === '' || activeOption !== tool) {
      setActiveOption(tool);
    } else {
      setActiveOption('');
    }
  };

  const openSiteList = async () => {
    showControl('Site List');
    const data = await (
      await fetch(publicRuntimeConfig.API_ROOT_URL + 'my/bookmarks/')
    ).json();
    setBookmarks(data);
  };

  return (
    <>
      {loader && <Loader />}
      <ToastContainer position="top-center" theme="colored" />
      <button
        className="flex items-center justify-center mb-2 text-lg leading-3 text-white rounded-full w-9 h-9 bg-primary2/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="icon-minus"></span>
        ) : (
          <span className="icon-plus"></span>
        )}
      </button>
      {isOpen && (
        <ul>
          <li className="relative">
            <button
              className={
                activeOption === 'Trade Area' ? 'onMapBtn active' : 'onMapBtn'
              }
              id="catchmentRing"
              onClick={() => {
                showControl('Trade Area');
                setCatchmentIsOpen(!catchmentIsOpen);
              }}
            >
              <span className="icon-settings"></span>
              <span className="toolTipLeft">Trade Area</span>
            </button>
            {activeOption === 'Trade Area' && (
              <div className="absolute w-56 p-5 -ml-3 rounded-md top-2 -left-56 bg-dark4">
                <h3>Trade Area</h3>
                {/* <input type="range" min="1" max="5"  /> */}
                <input
                  type="range"
                  list="tickmarks"
                  min="250"
                  max="2000"
                  step="250"
                  className="slider"
                  onChange={(e) => setTradeArea(parseInt(e.target.value))}
                />
                <ul className="flex justify-between mt-3 text-xs text-primary1">
                  <li>250 M</li>
                  <li>500 M</li>
                  <li></li>
                  <li>1 KM</li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li>2 KM</li>
                </ul>
              </div>
            )}
          </li>
          <li className="relative">
            <button
              className={
                activeOption === 'Identity Tool'
                  ? 'onMapBtn active'
                  : 'onMapBtn'
              }
              id="identityTool"
              onClick={() => showControl('Identity Tool')}
            >
              <span className="icon-info"></span>
              <span className="toolTipLeft">Identity Tool</span>
            </button>
          </li>
          <li className="relative">
            <button
              className={
                activeOption === 'Drop a pin' ? 'onMapBtn active' : 'onMapBtn'
              }
              id="dropAPin"
              onClick={() => showControl('Drop a pin')}
            >
              <span className="icon-marker"></span>
              <span className="toolTipLeft">Drop a pin</span>
            </button>
          </li>
          <li className="relative">
            <button className="onMapBtn" id="zoomToIndia" onClick={zoomToIndia}>
              <span className="icon-globe"></span>
              <span className="toolTipLeft">Zoom to India</span>
            </button>
          </li>
          <li className="relative">
            <button
              className={
                activeOption === 'upload' ? 'onMapBtn active' : 'onMapBtn'
              }
              id="upload"
              onClick={() => {
                showControl('upload');
                setUploadIsOpen(!uploadIsOpen);
              }}
            >
              <span className="icon-upload"></span>
              <span className="toolTipLeft">Upload</span>
            </button>
            {activeOption === 'upload' && (
              <div
                ref={uploadRef}
                className="absolute w-64 p-3 -ml-3 rounded-md top-2 -left-64 bg-dark4"
              >
                <form>
                  <div>
                    <h3 className="font-medium">Upload a file</h3>
                    {/* <div className='flex justify-between mt-2 text-secondary'>
                      Select a type
                      <select className='bg-transparent text-primary1'>
                        <option>Location</option>
                        <option>Location</option>
                      </select>
                    </div> */}
                    <div
                      className="relative w-full mt-5 btn-primary"
                      onClick={() => document.getElementById('file').click()}
                    >
                      <input
                        id="file"
                        type="file"
                        accept=".csv"
                        className="absolute inset-0 hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      Upload Location
                    </div>
                  </div>
                </form>
                {loading && <Loader within />}
                {uploadError && (
                  <p className="my-2 text-red-500">{uploadError}</p>
                )}
                {notification && (
                  <div className="my-2">
                    <p className="mb-2">Total Addresses: {addresses.total}</p>
                    <p>Processed Addresses: {addresses.passed}</p>
                  </div>
                )}
                <a
                  href="/Site_Monitoring_Upload.csv"
                  className="block mt-3 underline text-primary1 underline-offset-4"
                >
                  Download a sample file
                </a>
              </div>
            )}
          </li>
          <li className="relative">
            <button
              className={
                activeOption === 'Share Map' ? 'onMapBtn active' : 'onMapBtn'
              }
              id="shareMap"
              onClick={makeIframe}
            >
              <span className="icon-share"></span>
              <span className="toolTipLeft">Share Map</span>
            </button>
            {activeOption === 'Share Map' && (
              <div className="absolute p-2 -ml-3 rounded-md top-2 w-80 -left-80 bg-dark1/90">
                <h3>Share Map</h3>
                <button className="w-full my-2 btn-secondary" onClick={makePNG}>
                  Download
                </button>
                <p className="text-center">OR</p>
                <div>
                  <textarea className="mt-2 form-control" rows={5}>
                    {iframeContent}
                  </textarea>
                </div>
              </div>
            )}
          </li>
          <li className="relative">
            <button className="onMapBtn" id="help">
              <span className="icon-chat"></span>
              <span className="toolTipLeft">Help & Support</span>
            </button>
          </li>
          <li className="relative">
            <button
              className={
                activeOption === 'Site List' ? 'onMapBtn active' : 'onMapBtn'
              }
              id="siteList"
              onClick={openSiteList}
            >
              <span className="icon-history"></span>
              <span className="toolTipLeft">Site List</span>
            </button>
          </li>
        </ul>
      )}
      {activeOption === 'Site List' && (
        <RecentLocations bookmarks={bookmarks} />
      )}
    </>
  );
}

export default RightMenu;
