import React, { useState, useEffect, useRef } from 'react';
import SearchArea from './SearchArea';
import useMapStore from '../../stores/useMapStore';
import * as turf from '@turf/turf';
import getConfig from 'next/config';
import RankData from './RankData';
import ResultPanelME from '../result_panel/ResultPanelME';
import Legend from '../map_components/Legend';
import GeoMultiSelectMenu from '../popOutMenu/GeoMultiSelectMenu';
import MultiSelectMenu from '../popOutMenu/MultiSelectMenu';
import SingleSelectMenu from '../popOutMenu/SingleSelectMenu';
import Loader from '../../components/Loader';
const { publicRuntimeConfig } = getConfig();

function MarketExpansionMenu({ className, permission, close }) {
  const mktExpDdCheckBox = useRef();
  const resetStateSearch = useRef();
  const resetSocioeconomicSearch = useRef();
  const resetInfraSearch = useRef();
  const resetDemographySearch = useRef();
  const resetCSSearch = useRef();
  const resetPoISearch = useRef();
  const resetDpSearch = useRef();
  const map = useMapStore((state) => state.map);
  const [loader, setLoader] = useState(false);
  const [selectedDD, setSelectedDD] = useState();
  const [offset, setOffset] = useState();
  const [selectedMarket, setSelectedMarket] = useState('city');
  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [industries, setIndustries] = useState();
  const [industry, setIndustry] = useState('Industry');
  const [socioeconomic, setSocioeconomic] = useState();
  const [demography, setDemography] = useState();
  const [customerSegmentation, setCustomerSegmentation] = useState();
  const [poi, setPoi] = useState();
  const [infrastructure, setInfrastructure] = useState();
  const [digitalPenetration, setDigitalPenetration] = useState();
  const [rankData, setRankData] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState([]);
  const [legends, setLegends] = useState([]);
  const [indicator, setIndicator] = useState();
  const [identifier, setIdentifier] = useState('');
  const [graphData, setGraphData] = useState([]);
  const [showResults, setShowResults] = useState(false);

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
    map.setLayoutProperty('uploads', 'visibility', 'visible');
    map.setLayoutProperty('uploads-clusters', 'visibility', 'visible');
    map.setLayoutProperty('uploads-cluster-count', 'visibility', 'visible');
    map.setLayoutProperty('uploads-unclusters', 'visibility', 'none');
    getIndustries();
    getStates();
    getBroadCategories(selectedMarket);
    map.flyTo({ center: [78.626598, 22.838084], zoom: 4 });
  }, []);

  useEffect(() => {
    getBroadCategories(selectedMarket);
    return () => {
      setSocioeconomic();
      setDemography();
      setCustomerSegmentation();
      setPoi();
      setInfrastructure();
      setDigitalPenetration();
      setSelectedDataPoint([]);
      map.getSource('bubbles').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('heatmap').setData({
        type: 'FeatureCollection',
        features: [],
      });
      setLegends([]);
      setIndicator();
    };
  }, [selectedMarket]);

  useEffect(() => {
    manageSources();
    return () => {
      setCities([]);
      setDistricts([]);
    };
  }, [selectedStates, selectedMarket]);

  useEffect(() => {
    if (!map) return;
    let features = selectedMarket === 'city' ? [...cities] : [...districts];
    let fc = {
      type: 'FeatureCollection',
      features: [],
    };
    graphData.forEach((each) => {
      let feature = features.find(
        (element) => element.properties.name === each.x,
      );
      if (feature) {
        let state = states.find(
          (element) => element.properties.id === feature.properties.stat_cd,
        );
        let centroid;
        if (selectedMarket === 'city') {
          centroid = turf.centroid(feature.geometry);
        } else {
          centroid = turf.feature(feature.geometry);
        }
        centroid.properties = {
          name: feature.properties.name,
          state: state.properties.name,
          market_potential_score: each.y,
        };
        fc.features.push(centroid);
      }
    });

    if (fc.features.length > 0) {
      let array = [...fc.features],
        ranges = [],
        legend = [],
        indicators = [],
        middleIndex,
        interpolate = [
          'interpolate',
          ['linear'],
          ['get', 'market_potential_score'],
        ];
      if (Math.round(array.length / 5) < 1) {
        middleIndex = Math.ceil(array.length / 5);
      } else {
        middleIndex = Math.round(array.length / 5);
      }

      let first = array.splice(-middleIndex);
      let second = array.splice(-middleIndex);
      let third = array.splice(-middleIndex);
      let fourth = array.splice(-middleIndex);
      let fifth = array;

      ranges.push({
        value: first[0].properties.market_potential_score,
        color: 'rgba(230,230,230,0.8)',
      });
      legend.push({
        to: first[0].properties.market_potential_score,
        from: first[first.length - 1].properties.market_potential_score,
        color: 'rgb(230,230,230)',
      });
      if (first.length > 0 && second.length > 0) {
        if (
          first[0].properties.market_potential_score !=
          second[0].properties.market_potential_score
        ) {
          ranges.push({
            value: second[0].properties.market_potential_score,
            color: 'rgba(208,161,214,0.8)',
          });
          legend.push({
            to: second[0].properties.market_potential_score,
            from: second[second.length - 1].properties.market_potential_score,
            color: 'rgb(208,161,214)',
          });
        }
      }
      if (second.length > 0 && third.length > 0) {
        if (
          second[0].properties.market_potential_score !=
          third[0].properties.market_potential_score
        ) {
          ranges.push({
            value: third[0].properties.market_potential_score,
            color: 'rgba(213,100,200,0.8)',
          });
          legend.push({
            to: third[0].properties.market_potential_score,
            from: third[third.length - 1].properties.market_potential_score,
            color: 'rgb(213,100,200)',
          });
        }
      }
      if (third.length > 0 && fourth.length > 0) {
        if (
          third[0].properties.market_potential_score !=
          fourth[0].properties.market_potential_score
        ) {
          ranges.push({
            value: fourth[0].properties.market_potential_score,
            color: 'rgba(221,19,192,0.8)',
          });
          legend.push({
            to: fourth[0].properties.market_potential_score,
            from: fourth[fourth.length - 1].properties.market_potential_score,
            color: 'rgb(221,19,192)',
          });
        }
      }
      if (fourth.length > 0 && fifth.length > 0) {
        if (
          fourth[0].properties.market_potential_score !=
          fifth[0].properties.market_potential_score
        ) {
          ranges.push({
            value: fifth[0].properties.market_potential_score,
            color: 'rgba(136,0,228,0.8)',
          });
          legend.push({
            to: fifth[0].properties.market_potential_score,
            from: fifth[fifth.length - 1].properties.market_potential_score,
            color: 'rgb(136,0,228)',
          });
        }
      }

      setLegends(legend);
      setIndicator({ name: 'Market Potential Score', unit: 'Score' });
      ranges.map((x) => {
        interpolate.push(x.value);
        interpolate.push(x.color);
      });

      if (selectedMarket === 'city') {
        indicators = [
          ...new Set(
            fc.features.map((x) => x.properties.market_potential_score),
          ),
        ];
        map.getSource('bubbles').setData(fc);
        map.setPaintProperty('bubbles', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          [
            'interpolate',
            ['linear'],
            ['get', 'market_potential_score'],
            Math.min(...indicators),
            5,
            Math.max(...indicators),
            8,
          ],
          16,
          [
            'interpolate',
            ['linear'],
            ['get', 'market_potential_score'],
            Math.min(...indicators),
            9,
            Math.max(...indicators),
            54,
          ],
        ]);
        map.setPaintProperty('bubbles', 'circle-color', interpolate);
      } else {
        map.getSource('heatmap').setData(fc);
        map.setPaintProperty('heatmap', 'fill-opacity', 0.4);
        map.setPaintProperty('heatmap', 'fill-outline-color', interpolate);
        map.setPaintProperty('heatmap', 'fill-color', interpolate);
      }
    }
  }, [graphData]);

  const restSelected = () => {
    resetStateSearch.current.resetSearch();
    resetSocioeconomicSearch.current.resetSearch();
    resetInfraSearch.current.resetSearch();
    resetDemographySearch.current.resetSearch();
    resetCSSearch.current.resetSearch();
    resetPoISearch.current.resetSearch();
    resetDpSearch.current.resetSearch();
    for (
      let i = 0;
      i <
      mktExpDdCheckBox.current.querySelectorAll('input[type=checkbox]').length;
      i++
    ) {
      mktExpDdCheckBox.current.querySelectorAll('input[type=checkbox]')[
        i
      ].checked = false;
    }
    setSelectedStates([]);
    setIndustry('Industry');
    setSelectedDataPoint([]);
    setSelectedMarket('city');
    setGraphData([]);
    setCities([]);
    setDistricts([]);
    setLegends([]);
    setShowResults(false);
    let fc = {
      type: 'FeatureCollection',
      features: [],
    };
    map.getSource('bubbles').setData(fc);
    map.getSource('heatmap').setData(fc);
    map.flyTo({ center: [78.626598, 22.838084], zoom: 4 });
  };

  const manageSources = async () => {
    if (selectedStates.length > 0) {
      let filteredStates = states.filter((x) =>
        selectedStates.includes(x.properties.name),
      );
      let bbox = turf.bbox({
        type: 'FeatureCollection',
        features: filteredStates,
      });
      map.fitBounds(bbox, {
        padding: 20,
      });
      let state_id = filteredStates.map((x) => x.properties.id);
      setIdentifier(filteredStates.map((x) => x.properties.stat_cd));
      if (selectedMarket === 'city') {
        let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'cities', {
          method: 'POST',
          body: JSON.stringify({
            state_id,
            f: 'market-expansion',
          }),
          headers: {
            'content-type': 'application/json',
          },
          redirect: 'follow',
        });
        let data = await res.json();
        if (data && data.features) {
          setCities(data.features);
        }
      } else {
        let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'districts', {
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
        if (data && data.features) {
          setDistricts(data.features);
        }
      }
    }
  };

  const getIndustries = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'industries');
    setIndustries(await res.json());
  };

  const getStates = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'states');
    let data = await res.json();
    setStates(data.features);
  };

  const getBroadCategories = async (market) => {
    let resSocioeconomic = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        market +
        '/socioeconomic',
    );
    setSocioeconomic(await resSocioeconomic.json());

    let resDemography = await fetch(
      publicRuntimeConfig.API_ROOT_URL + 'indicators/' + market + '/demography',
    );
    setDemography(await resDemography.json());

    let resCS = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        market +
        '/customer-segmentation',
    );
    setCustomerSegmentation(await resCS.json());
    let resPoi = await fetch(
      publicRuntimeConfig.API_ROOT_URL + 'indicators/' + market + '/poi',
    );
    setPoi(await resPoi.json());

    let resInfrastructure = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        market +
        '/infrastructure',
    );
    setInfrastructure(await resInfrastructure.json());

    let resDp = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        market +
        '/digital-penetration',
    );
    setDigitalPenetration(await resDp.json());
  };

  const showDD = (e) => {
    let position = e.target.getBoundingClientRect();
    setOffset({
      top: position.top,
      left: position.left + position.width + 10,
    });
    setSelectedDD(e.target.title);
  };

  const selectIndustry = (industry) => {
    setIndustry(industry);
    setSelectedDD('');
  };

  const deleteDataPoint = (dp) => {
    let filteredDP = selectedDataPoint.filter((item) => item.name !== dp);
    setSelectedDataPoint(filteredDP);
    setLegends([]);
    setIndicator();
  };

  const deleteState = (st) => {
    let filteredStates = selectedStates.filter((state) => state !== st);
    setSelectedStates(filteredStates);
  };

  const showOnMap = async (dp) => {
    if (selectedStates.length > 0) {
      let filteredStates = states.filter((x) =>
        selectedStates.includes(x.properties.name),
      );
      let fc = {
        type: 'FeatureCollection',
        features: [],
      };
      let indicators = [],
        middleIndex,
        ranges = [],
        legend = [],
        interpolate = ['interpolate', ['linear'], ['get', dp.indicatr]];

      if (dp.table_name == 'city') {
        cities.forEach((x) => {
          let state = states.find(
            (y) => y.properties.id === x.properties.stat_cd,
          );
          let properties = {
            name: x.properties.name,
            state: state.properties.name,
            // indicator: dp.name,
          };
          properties[dp.indicatr] = x.properties[dp.indicatr]
            ? x.properties[dp.indicatr]
            : 0;
          var centroid = turf.centroid(x.geometry);
          centroid.properties = properties;
          fc.features.push(centroid);
        });

        indicators = [
          ...new Set(
            fc.features.map((x) => {
              if (x.properties[dp.indicatr]) return x.properties[dp.indicatr];
            }),
          ),
        ];
      } else if (dp.table_name == 'district') {
        districts.forEach((x) => {
          let state = states.find(
            (y) => y.properties.id === x.properties.stat_cd,
          );
          let properties = {
            name: x.properties.name,
            state: state.properties.name,
            // indicator: dp.name,
          };
          properties[dp.indicatr] = x.properties[dp.indicatr]
            ? x.properties[dp.indicatr]
            : 0;
          var feature = turf.feature(x.geometry);
          feature.properties = properties;
          fc.features.push(feature);
        });

        indicators = [
          ...new Set(
            fc.features.map((x) => {
              if (x.properties[dp.indicatr]) return x.properties[dp.indicatr];
            }),
          ),
        ];
      } else {
        let resDp = await fetch(
          publicRuntimeConfig.API_ROOT_URL + 'market-expansion',
          {
            method: 'POST',
            body: JSON.stringify({
              geolevel: selectedMarket,
              table_name: dp.table_name,
              state_id: filteredStates.map((x) => x.properties.id),
            }),
            headers: {
              'content-type': 'application/json',
            },
            redirect: 'follow',
          },
        );
        const data = await resDp.json();

        if (selectedMarket === 'city') {
          data.forEach((x) => {
            let city = cities.find(
              (y) => y.properties.id === parseInt(x.town_cd),
            );
            let state = states.find(
              (y) => y.properties.id === city.properties.stat_cd,
            );
            let feature = turf.centroid(city.geometry);
            let properties = {
              name: city.properties.name,
              state: state.properties.name,
              // indicator: dp.name,
            };
            properties[dp.indicatr] = x[dp.indicatr] ? x[dp.indicatr] : 0;
            feature.properties = properties;
            fc.features.push(feature);
          });
        } else {
          data.forEach((x) => {
            let district = districts.find(
              (y) => y.properties.id === parseInt(x.dist_cd),
            );
            let state = states.find(
              (y) => y.properties.id === district.properties.stat_cd,
            );
            let feature = turf.feature(district.geometry);
            let properties = {
              name: district.properties.name,
              state: state.properties.name,
              // indicator: dp.name,
            };
            properties[dp.indicatr] = x[dp.indicatr] ? x[dp.indicatr] : 0;
            feature.properties = properties;
            fc.features.push(feature);
          });
        }

        indicators = [
          ...new Set(
            data.map((x) => {
              if (x[dp.indicatr]) return x[dp.indicatr];
            }),
          ),
        ];
      }

      var array = [...fc.features];
      array.sort(
        (a, b) => b.properties[dp.indicatr] - a.properties[dp.indicatr],
      );
      if (Math.round(array.length / 5) < 1) {
        middleIndex = Math.ceil(array.length / 5);
      } else {
        middleIndex = Math.round(array.length / 5);
      }

      var first = array.splice(-middleIndex);
      var second = array.splice(-middleIndex);
      var third = array.splice(-middleIndex);
      var fourth = array.splice(-middleIndex);
      var fifth = array;

      ranges.push({
        value: first[0].properties[dp.indicatr],
        color: 'rgba(230,230,230,0.8)',
      });
      legend.push({
        to: first[0].properties[dp.indicatr],
        from: first[first.length - 1].properties[dp.indicatr],
        color: 'rgb(230,230,230)',
      });

      if (first.length > 0 && second.length > 0) {
        if (
          first[0].properties[dp.indicatr] != second[0].properties[dp.indicatr]
        ) {
          ranges.push({
            value: second[0].properties[dp.indicatr],
            color: 'rgba(208,161,214,0.8)',
          });
          legend.push({
            to: second[0].properties[dp.indicatr],
            from: second[second.length - 1].properties[dp.indicatr],
            color: 'rgb(208,161,214)',
          });
        }
      }
      if (second.length > 0 && third.length > 0) {
        if (
          second[0].properties[dp.indicatr] != third[0].properties[dp.indicatr]
        ) {
          ranges.push({
            value: third[0].properties[dp.indicatr],
            color: 'rgba(213,100,200,0.8)',
          });
          legend.push({
            to: third[0].properties[dp.indicatr],
            from: third[third.length - 1].properties[dp.indicatr],
            color: 'rgb(213,100,200)',
          });
        }
      }
      if (third.length > 0 && fourth.length > 0) {
        if (
          third[0].properties[dp.indicatr] != fourth[0].properties[dp.indicatr]
        ) {
          ranges.push({
            value: fourth[0].properties[dp.indicatr],
            color: 'rgba(221,19,192,0.8)',
          });
          legend.push({
            to: fourth[0].properties[dp.indicatr],
            from: fourth[fourth.length - 1].properties[dp.indicatr],
            color: 'rgb(221,19,192)',
          });
        }
      }
      if (fourth.length > 0 && fifth.length > 0) {
        if (
          fourth[0].properties[dp.indicatr] != fifth[0].properties[dp.indicatr]
        ) {
          ranges.push({
            value: fifth[0].properties[dp.indicatr],
            color: 'rgba(136,0,228,0.8)',
          });
          legend.push({
            to: fifth[0].properties[dp.indicatr],
            from: fifth[fifth.length - 1].properties[dp.indicatr],
            color: 'rgb(136,0,228)',
          });
        }
      }

      let unitres = await fetch(publicRuntimeConfig.API_ROOT_URL + 'unit', {
        method: 'POST',
        body: JSON.stringify({
          id: dp.unit_id,
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      });
      let unitdata = await unitres.json();
      setLegends(legend);
      setIndicator({ name: dp.name, unit: unitdata.unitname });

      ranges.map((x) => {
        interpolate.push(x.value);
        interpolate.push(x.color);
      });
      if (selectedMarket == 'city') {
        map.getSource('bubbles').setData(fc);
        map.setPaintProperty('bubbles', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          [
            'interpolate',
            ['linear'],
            ['get', dp.indicatr],
            Math.min(...indicators),
            5,
            Math.max(...indicators),
            8,
          ],
          16,
          [
            'interpolate',
            ['linear'],
            ['get', dp.indicatr],
            Math.min(...indicators),
            9,
            Math.max(...indicators),
            54,
          ],
        ]);
        map.setPaintProperty('bubbles', 'circle-color', interpolate);
      } else {
        map.getSource('heatmap').setData(fc);
        map.setPaintProperty('heatmap', 'fill-color', interpolate);
      }
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className={'subMenu ' + className}>
        <span
          onClick={close}
          className="fixed ml-10 cursor-pointer icon-cancel top-2 left-80"
        ></span>
        <div className={rankData ? 'hidden' : ''}>
          {!rankData && <SearchArea className="mb-6" />}

          <h3 className="flex items-center justify-between mb-4 text-base font-medium">
            Market Expansion{' '}
            <span
              title="Reset"
              className="transition-all ease-in-out cursor-pointer icon-history text-primary1 hover:text-white"
              onClick={restSelected}
            ></span>
          </h3>
          <div
            className={
              'dropRight ' +
              (!industries ? 'opacity-30 pointer-events-none' : '')
            }
            id="industry"
            title="Industry"
            onMouseOver={showDD}
          >
            {industries ? industry : 'Loading...'}
            <span className="absolute icon-rght-arrow right-3 top-3"></span>
          </div>
          <div
            className={
              'dropRight ' +
              (!states.length ? 'opacity-30 pointer-events-none' : '')
            }
            id="states"
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

          <p className="mb-3">Select a market</p>
          <div className="flex justify-between">
            <button
              className={`btnTab ${selectedMarket === 'city' && 'active'}`}
              id="urban"
              onClick={() => setSelectedMarket('city')}
            >
              Urban
            </button>
            <button
              className={`btnTab ${selectedMarket === 'district' && 'active'}`}
              id="rural"
              onClick={() => setSelectedMarket('district')}
            >
              Rural
            </button>
          </div>

          {selectedStates.length > 0 ? (
            <>
              <hr className="my-6 border-primary1" />

              <h3 className="mb-4 text-base font-medium">Data Layers</h3>

              <ul className="-mx-4 2xl:-mx-6 menuUl">
                {permission.socioeconomics && (
                  <li
                    title="Socioeconomic"
                    id="socioeconomic"
                    onMouseOver={showDD}
                  >
                    Socioeconomic <span className="icon-rght-arrow"></span>
                  </li>
                )}
                {permission.demography && (
                  <li title="Demography" id="demography" onMouseOver={showDD}>
                    Demography <span className="icon-rght-arrow"></span>
                  </li>
                )}
                {permission.customer_segment && (
                  <li
                    title="Customer Segmentation"
                    id="customerSegmentation"
                    onMouseOver={showDD}
                  >
                    Customer Segmentation{' '}
                    <span className="icon-rght-arrow"></span>
                  </li>
                )}
                {permission.poi && (
                  <li title="Points of Interest" id="poi" onMouseOver={showDD}>
                    Points of Interest <span className="icon-rght-arrow"></span>
                  </li>
                )}
                {permission.infrastructure && (
                  <li
                    title="Infrastructure"
                    id="infrastructure"
                    onMouseOver={showDD}
                  >
                    Infrastructure <span className="icon-rght-arrow"></span>
                  </li>
                )}
                {permission.digital_penetration && (
                  <li
                    title="Digital Penetration"
                    id="digitalPenetration"
                    onMouseOver={showDD}
                  >
                    Digital Penetration{' '}
                    <span className="icon-rght-arrow"></span>
                  </li>
                )}
              </ul>
            </>
          ) : (
            <div></div>
          )}

          {selectedDataPoint.length > 0 && (
            <>
              <hr className="my-6 border-primary1" />
              <h3 className="mb-4 text-base font-medium">
                Selected Data Layers
              </h3>
              <div className="border border-primary1 p-2 grid grid-cols-2 gap-2 text-[10px] rounded-md">
                {selectedDataPoint.map((select, index) => (
                  <div
                    className="flex items-center justify-between px-2 py-1 border rounded-md border-primary1"
                    key={index}
                  >
                    {select.name}{' '}
                    <span
                      className="ml-2 text-red-300 icon-cancel"
                      onClick={() => deleteDataPoint(select.name)}
                    ></span>
                  </div>
                ))}
              </div>
              <button
                className="w-full my-4 btn-primary"
                onClick={() => setRankData(true)}
              >
                Rank Data Layers
              </button>
            </>
          )}
        </div>

        <div
          className={`absolute inset-0 bg-dark4 transition-all 2xl:p-5 p-3 ${
            rankData ? 'opacity-100 visible z-10' : 'opacity-0 invisible -z-10'
          }`}
        >
          {rankData && <SearchArea className="mb-6" />}
          <RankData
            data={selectedDataPoint}
            back={() => setRankData(false)}
            deleteDp={(data) => deleteDataPoint(data)}
            enableOnMap={(data) => showOnMap(data)}
            selectedMarket={selectedMarket}
            identifier={identifier}
            graphData={(data) => {
              setGraphData(data);
              setShowResults(true);
            }}
            resultSwitch={showResults}
            features={selectedMarket === 'city' ? cities : districts}
          />
        </div>
      </div>

      <div
        ref={mktExpDdCheckBox}
        className={className + (rankData ? ' hidden' : '')}
      >
        <SingleSelectMenu
          show={selectedDD === 'Industry'}
          options={industries}
          activeOpt={industry}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => setSelectedDD('')}
          selected={(industry) => selectIndustry(industry)}
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

        {permission.socioeconomics && (
          <MultiSelectMenu
            show={selectedDD === 'Socioeconomic'}
            options={socioeconomic}
            selectedOpts={selectedDataPoint}
            offset={offset}
            mouseLeave={() => setSelectedDD('')}
            selected={(selectedDP) =>
              setSelectedDataPoint([...selectedDataPoint, selectedDP])
            }
            deleted={deleteDataPoint}
            ref={resetSocioeconomicSearch}
          />
        )}

        {permission.demography && (
          <MultiSelectMenu
            show={selectedDD === 'Demography'}
            options={demography}
            selectedOpts={selectedDataPoint}
            offset={offset}
            mouseLeave={() => setSelectedDD('')}
            selected={(selectedDP) =>
              setSelectedDataPoint([...selectedDataPoint, selectedDP])
            }
            deleted={deleteDataPoint}
            ref={resetDemographySearch}
          />
        )}

        {permission.customer_segment && (
          <MultiSelectMenu
            show={selectedDD === 'Customer Segmentation'}
            options={customerSegmentation}
            selectedOpts={selectedDataPoint}
            offset={offset}
            mouseLeave={() => setSelectedDD('')}
            selected={(selectedDP) =>
              setSelectedDataPoint([...selectedDataPoint, selectedDP])
            }
            deleted={deleteDataPoint}
            subLevel={3}
            ref={resetCSSearch}
          />
        )}

        {permission.poi && (
          <MultiSelectMenu
            show={selectedDD === 'Points of Interest'}
            options={poi}
            selectedOpts={selectedDataPoint}
            offset={offset}
            mouseLeave={() => setSelectedDD('')}
            selected={(selectedDP) =>
              setSelectedDataPoint([...selectedDataPoint, selectedDP])
            }
            deleted={deleteDataPoint}
            subLevel={2}
            ref={resetPoISearch}
          />
        )}

        {permission.infrastructure && (
          <MultiSelectMenu
            show={selectedDD === 'Infrastructure'}
            options={infrastructure}
            selectedOpts={selectedDataPoint}
            offset={offset}
            mouseLeave={() => setSelectedDD('')}
            selected={(selectedDP) =>
              setSelectedDataPoint([...selectedDataPoint, selectedDP])
            }
            deleted={deleteDataPoint}
            ref={resetInfraSearch}
          />
        )}

        {permission.digital_penetration && (
          <MultiSelectMenu
            show={selectedDD === 'Digital Penetration'}
            options={digitalPenetration}
            selectedOpts={selectedDataPoint}
            offset={offset}
            mouseLeave={() => setSelectedDD('')}
            selected={(selectedDP) =>
              setSelectedDataPoint([...selectedDataPoint, selectedDP])
            }
            deleted={deleteDataPoint}
            ref={resetDpSearch}
          />
        )}
      </div>

      <ResultPanelME
        graphData={graphData}
        selectedMarket={selectedMarket}
        features={selectedMarket === 'city' ? cities : districts}
        isOpen={showResults}
        close={() => setShowResults(false)}
      />

      <Legend indicator={indicator} legends={legends} />
    </>
  );
}

export default MarketExpansionMenu;
