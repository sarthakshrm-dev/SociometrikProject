import React, { useState, useEffect, useRef } from 'react';
import SearchArea from './SearchArea';
import useMapStore from '../../stores/useMapStore';
import * as turf from '@turf/turf';
import getConfig from 'next/config';
// import Legend from '../map_components/Legend';
import GeoMultiSelectMenu from '../popOutMenu/GeoMultiSelectMenu';
import MultiSelectMenu from '../popOutMenu/MultiSelectMenu';
import Loader from '../../components/Loader';
import DatePicker from 'react-datepicker';
import ResultPanelSM from '../result_panel/ResultPanelSM';
import globalStore from '../../stores/global';
const { publicRuntimeConfig } = getConfig();

function SiteMonitoring({ className, permission, close }) {
  const { uploadIsOpen, setUploadIsOpen, catchmentIsOpen, setCatchmentIsOpen } =
    globalStore((state) => state);
  const mktExpDdCheckBox = useRef();
  const resetCompetitorSearch = useRef();
  const resetStateSearch = useRef();
  // const resetDistrictSearch = useRef();
  const resetCitySearch = useRef();
  const resetSelected = useRef();
  const map = useMapStore((state) => state.map);
  const [loader, setLoader] = useState(false);
  const [selectedDD, setSelectedDD] = useState();
  const [offset, setOffset] = useState();
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showResults, setShowResults] = useState(false);
  const [poiC, setPoiC] = useState([]);

  useEffect(() => {
    if (!map) return;
    map.getSource('heatmap').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('bubbles').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('hexgrids').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('pointPOIs').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('grids').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('villages').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('uploads').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('uploads-unclusters').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('catchment').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.setFilter('hex-highlighted', ['==', 'name', '']);
    map.setFilter('heat-highlighted', ['==', 'village_cd', '']);
    map.setFilter('catchment-highlighted', ['==', 'ID', '']);
    map.setLayoutProperty('uploads', 'visibility', 'visible');
    map.setLayoutProperty('uploads-clusters', 'visibility', 'visible');
    map.setLayoutProperty('uploads-cluster-count', 'visibility', 'visible');
    map.setLayoutProperty('uploads-unclusters', 'visibility', 'none');
    getStates();
    getCompetitors();
    map.flyTo({ center: [78.626598, 22.838084], zoom: 4 });
  }, []);

  useEffect(() => {
    if (selectedStates.length == 0 || !map) return;
    manageSources();
    return () => {
      setCities([]);
      setSelectedCities([]);
    };
  }, [selectedStates]);

  useEffect(() => {
    if (selectedCities.length == 0 || !map) return;
    manageSources2();
  }, [selectedCities]);

  useEffect(() => {
    if (selectedCompetitors.length == 0 || selectedCities.length == 0) return;
    managePoiC();
    return () => {
      setPoiC([]);
      map.getSource('pointPOIs').setData({
        type: 'FeatureCollection',
        features: [],
      });
    };
  }, [selectedCompetitors, selectedCities]);

  const managePoiC = async () => {
    let brand_code = selectedCompetitors.map((x) => x.indicatr);
    let city_id = cities
      .filter((x) => selectedCities.includes(x.properties.name))
      .map((x) => x.properties.id);
    setLoader(true);
    const res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'competitors', {
      method: 'POST',
      body: JSON.stringify({
        brand_code,
        city_id,
      }),
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
    });
    let data = await res.json();
    setLoader(false);
    setPoiC(data.features);
    map.getSource('pointPOIs').setData(data);
  };

  const manageSources = async () => {
    let state_id = states
      .filter((x) => selectedStates.includes(x.properties.name))
      .map((x) => x.properties.id);

    setLoader(true);
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'cities', {
      method: 'POST',
      body: JSON.stringify({
        state_id,
      }),
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
    });
    let data = await res.json();
    setLoader(false);
    if (data && data.features) {
      setCities(data.features);
      // map.getSource('village').setData(data);
      let bbox = turf.bbox(data);
      map.fitBounds(bbox, {
        padding: 20,
      });
    }
  };

  const manageSources2 = async () => {
    let features = cities.filter((x) =>
      selectedCities.includes(x.properties.name),
    );
    if (features.length > 0) {
      let bbox = turf.bbox({
        type: 'FeatureCollection',
        features: features,
      });
      map.fitBounds(bbox, {
        padding: 20,
      });
    }
  };

  const restSelected = () => {};

  const getStates = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'states');
    let data = await res.json();
    setStates(data.features);
  };

  const getCompetitors = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'competitors');
    setCompetitors(await res.json());
  };

  const showDD = (e) => {
    let position = e.target.getBoundingClientRect();
    setOffset({
      top: position.top,
      left: position.left + position.width + 10,
    });
    setSelectedDD(e.target.title);
  };

  const deleteCompetitor = (dp) => {
    let deletedDp = selectedCompetitors.find((item) => item.indicatr === dp);
    let filteredDP = selectedCompetitors.filter((item) => item.indicatr !== dp);
    setSelectedCompetitors(filteredDP);
    let element = document.getElementById(deletedDp.target);
    if (element && element.checked) {
      element.checked = false;
    }
  };

  const deleteState = (st) => {
    let filteredStates = selectedStates.filter((state) => state !== st);
    setSelectedStates(filteredStates);
  };

  const deleteCity = (ct) => {
    let filteredCities = selectedCities.filter((city) => city !== ct);
    setSelectedCities(filteredCities);
  };

  return (
    <>
      {loader && <Loader />}
      <div className={'subMenu ' + className}>
        <span
          onClick={close}
          className="fixed ml-10 cursor-pointer icon-cancel top-2 left-80"
        ></span>
        <div>
          <SearchArea className="mb-8" />

          <h3 className="flex items-center justify-between mb-4 text-base font-medium">
            Site Monitoring{' '}
            <span
              title="Reset"
              className="transition-all ease-in-out cursor-pointer icon-history text-primary1 hover:text-white"
              onClick={restSelected}
            ></span>
          </h3>

          <p className="text-xs font-medium">Kindly upload your data</p>
          <button
            className={`w-full mt-4 btn-primary ${
              uploadIsOpen ? 'opacity-60' : ''
            }`}
            onClick={() => {
              setUploadIsOpen(!uploadIsOpen);
              setCatchmentIsOpen(false);
            }}
          >
            Upload
          </button>
          <p className="text-[10px] text-primary1">
            File Type: PDF, Excel and Word document
          </p>

          <hr className="my-6 border-primary1" />

          <div
            className={
              'dropRight ' +
              (!states.length ? 'opacity-30 pointer-events-none' : '')
            }
            title="State"
            onMouseOver={showDD}
          >
            {selectedStates.length
              ? selectedStates.join(', ')
              : states.length
              ? 'Select State'
              : 'Loading...'}
            <span className="absolute icon-rght-arrow right-3 top-3"></span>
          </div>

          <div
            className={
              'dropRight ' +
              (!cities.length ? 'opacity-30 pointer-events-none' : '')
            }
            title="City"
            onMouseOver={showDD}
          >
            {selectedCities.length
              ? selectedCities.join(', ')
              : cities.length
              ? 'Select City'
              : 'City'}
            <span className="absolute icon-rght-arrow right-3 top-3"></span>
          </div>

          <div
            className={
              'dropRight ' +
              (!competitors.length ? 'opacity-30 pointer-events-none' : '')
            }
            title="Competitor"
            onMouseOver={showDD}
          >
            {selectedCompetitors.length
              ? selectedCompetitors.map((x) => x.name).join(', ')
              : competitors.length
              ? 'Select Competitors'
              : 'Competitors'}
            <span className="absolute icon-rght-arrow right-3 top-3"></span>
          </div>

          <hr className="my-6 border-primary1" />

          <button
            className={`w-full mb-6 btn-primary ${
              catchmentIsOpen ? 'opacity-60' : ''
            }`}
            onClick={() => {
              setCatchmentIsOpen(!catchmentIsOpen);
              setUploadIsOpen(false);
            }}
          >
            Select trade area
          </button>

          <h3 className="mb-4 font-medium">Monitor footfall</h3>

          <div className="flex gap-3">
            <div>
              <label className="text-xs">From</label>
              <DatePicker
                selectsStart
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                className="form-control"
              />
            </div>
            <div>
              <label className="text-xs">To</label>
              <DatePicker
                selectsEnd
                selected={fromDate}
                minDate={fromDate}
                onChange={(date) => setToDate(date)}
                className="form-control"
                startDate={fromDate}
              />
            </div>
          </div>

          <button
            className="w-full my-6 btn-primary"
            onClick={() => setShowResults(true)}
          >
            Submit
          </button>
        </div>
      </div>

      <div ref={mktExpDdCheckBox}>
        <MultiSelectMenu
          show={selectedDD === 'Competitor'}
          options={competitors}
          selectedOpts={selectedCompetitors}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => setSelectedDD('')}
          selected={(competitor) =>
            setSelectedCompetitors([...selectedCompetitors, competitor])
          }
          deleted={deleteCompetitor}
          subLevel={2}
          ref={resetCompetitorSearch}
        />

        <GeoMultiSelectMenu
          show={selectedDD === 'State'}
          options={states}
          selectedOpts={selectedStates}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => setSelectedDD('')}
          selected={(state) => {
            Array.isArray(state)
              ? setSelectedStates(state)
              : setSelectedStates([...selectedStates, state]);
          }}
          deleted={deleteState}
          ref={resetStateSearch}
        />

        <GeoMultiSelectMenu
          show={selectedDD === 'City'}
          options={cities}
          selectedOpts={selectedCities}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => setSelectedDD('')}
          selected={(city) => {
            Array.isArray(city)
              ? setSelectedCities(city)
              : setSelectedCities([...selectedCities, city]);
          }}
          deleted={deleteCity}
          ref={resetCitySearch}
        />
      </div>

      <ResultPanelSM
        states={states}
        cities={cities}
        isOpen={showResults}
        close={() => setShowResults(false)}
        ref={resetSelected}
      />

      {/* <Legend indicator={indicator} legends={legends} /> */}
    </>
  );
}

export default SiteMonitoring;
