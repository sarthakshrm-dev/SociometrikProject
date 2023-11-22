import React, { useState, useEffect, useRef } from 'react';
import SearchArea from './SearchArea';
import useMapStore from '../../stores/useMapStore';
import * as turf from '@turf/turf';
import getConfig from 'next/config';
import RankData from './RankData';
import ResultPanelSS from '../result_panel/ResultPanelSS';
import Legend from '../map_components/Legend';
import CompareSite from '../result_panel/CompareSite';
import { cellsToMultiPolygon } from 'h3-js';
import GeoMultiSelectMenu from '../popOutMenu/GeoMultiSelectMenu';
import MultiSelectMenu from '../popOutMenu/MultiSelectMenu';
import SingleSelectMenu from '../popOutMenu/SingleSelectMenu';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
const { publicRuntimeConfig } = getConfig();

function SiteSelection({ className, permission, close }) {
  const mktExpDdCheckBox = useRef();
  const resetStateSearch = useRef();
  const resetCompetitorSearch = useRef();
  const resetCitySearch = useRef();
  const resetDistrictSearch = useRef();
  const resetSocioeconomicSearch = useRef();
  const resetCSSearch = useRef();
  const resetInfraSearch = useRef();
  const resetDemographySearch = useRef();
  const resetPoISearch = useRef();
  const resetDpSearch = useRef();
  const resetFootfallSearch = useRef();
  const resetSelected = useRef();
  const map = useMapStore((state) => state.map);
  const [loader, setLoader] = useState(false);
  const [selectedDD, setSelectedDD] = useState();
  const [offset, setOffset] = useState();
  const [selectedMarket, setSelectedMarket] = useState('h8');
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [poiC, setPoiC] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [grids, setGrids] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [industries, setIndustries] = useState();
  const [industry, setIndustry] = useState('Industry');
  const [socioeconomic, setSocioeconomic] = useState();
  const [demography, setDemography] = useState();
  const [customerSegmentation, setCustomerSegmentation] = useState();
  const [poi, setPoi] = useState();
  const [infrastructure, setInfrastructure] = useState();
  const [digitalPenetration, setDigitalPenetration] = useState();
  const [footfall, setFootfall] = useState();
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
    manageLocalities();
    setGrids([]);
    setVillages([]);
    getIndustries();
    getStates();
    getCompetitors();
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
      map.getSource('hexgrids').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('grids').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('pointPOIs').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('heatmap').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('villages').setData({
        type: 'FeatureCollection',
        features: [],
      });
      setLegends([]);
      setIndicator();
      setCities([]);
      setSelectedCities([]);
      setDistricts([]);
      setSelectedDistricts([]);
      setGrids([]);
      setVillages([]);
    };
  }, [selectedMarket]);

  useEffect(() => {
    if (selectedStates.length == 0 || !map) return;
    manageSources();
    return () => {
      setCities([]);
      setSelectedCities([]);
      setDistricts([]);
      setSelectedDistricts([]);
    };
  }, [selectedStates, selectedMarket]);

  useEffect(() => {
    if (!map) return;
    manageSources2();
    return () => {
      setGrids([]);
      setVillages([]);
      map.getSource('heatmap').setData({
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
    };
  }, [selectedCities, selectedDistricts]);

  useEffect(() => {
    if (selectedCompetitors.length == 0) return;
    managePoiC();
    return () => {
      setPoiC([]);
      map.getSource('pointPOIs').setData({
        type: 'FeatureCollection',
        features: [],
      });
    };
  }, [selectedCompetitors]);

  useEffect(() => {
    if (!map) return;
    let features = selectedMarket === 'h8' ? [...grids] : [...villages];
    let fc = {
      type: 'FeatureCollection',
      features: [],
    };
    graphData.forEach((each) => {
      let feature = features.find((element) => {
        return selectedMarket === 'h8'
          ? element.properties.hexid08 == each.x.split(',')[0]
          : element.properties.name == each.x.split(',')[0];
      });
      if (feature) {
        let state = states.find(
          (element) => element.properties.id == feature.properties.stat_cd,
        );
        let feat = turf.feature(feature.geometry);
        feat.properties = {
          name:
            selectedMarket === 'h8'
              ? feature.properties.hexid08
              : feature.properties.name,
          state: state.properties.name,
          market_potential_score: each.y,
        };
        if (selectedMarket === 'h8') {
          var centroid = turf.centroid(feature.geometry);
          feat.properties['id'] = feature.properties.id;
          feat.properties['hexid08'] = feature.properties.hexid08;
          feat.properties['t_name'] = feature.properties.t_name;
          feat.properties['town_cd'] = feature.properties.town_cd;
          feat.properties['center'] =
            centroid.geometry.coordinates[0].toFixed(3) +
            ', ' +
            centroid.geometry.coordinates[1].toFixed(3);
          feat.properties['locality_id'] = feature.properties.locality_id;
          let locality = localities.find(
            (element) =>
              element.properties.id == feature.properties.locality_id,
          );
          feat.properties['locality'] = locality
            ? locality.properties.name
            : 'Not provided';
        } else {
          let district = districts.find(
            (element) => element.properties.id == feature.properties.dist_cd,
          );
          feat.properties['district'] = district.properties.name;
          feat.properties['dist_cd'] = feature.properties.dist_cd;
          feat.properties['village_cd'] = feature.properties.village_cd;
        }
        feat.properties['stat_cd'] = feature.properties.stat_cd;
        fc.features.push(feat);
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

      if (selectedMarket === 'h8') {
        indicators = [
          ...new Set(
            fc.features.map((x) => x.properties.market_potential_score),
          ),
        ];
        map.getSource('hexgrids').setData(fc);
        map.setPaintProperty('hexgrids', 'fill-opacity', 0.4);
        map.setPaintProperty('hexgrids', 'fill-outline-color', interpolate);
        map.setPaintProperty('hexgrids', 'fill-color', interpolate);
      } else {
        map.getSource('heatmap').setData(fc);
        map.setPaintProperty('heatmap', 'fill-opacity', 0.4);
        map.setPaintProperty('heatmap', 'fill-outline-color', interpolate);
        map.setPaintProperty('heatmap', 'fill-color', interpolate);
      }
    }
  }, [graphData]);

  const manageLocalities = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'localities');
    let data = await res.json();
    setLocalities(data.features);
  };

  const restSelected = () => {
    setShowResults(false);
    resetSelected.current.resetSelectedLoc();
    resetStateSearch.current.resetSearch();
    resetCompetitorSearch.current.resetSearch();
    resetCitySearch.current.resetSearch();
    resetDistrictSearch.current.resetSearch();
    resetSocioeconomicSearch.current.resetSearch();
    resetCSSearch.current.resetSearch();
    resetInfraSearch.current.resetSearch();
    resetDemographySearch.current.resetSearch();
    resetPoISearch.current.resetSearch();
    resetDpSearch.current.resetSearch();
    resetFootfallSearch.current.resetSearch();
    setSelectedStates([]);
    setSelectedCompetitors([]);
    setIndustry('Industry');
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
    setSelectedDataPoint([]);
    setSelectedMarket('h8');
  };

  const manageSources = async () => {
    let state_id = states
      .filter((x) => selectedStates.includes(x.properties.name))
      .map((x) => x.properties.id);
    if (selectedMarket === 'h8') {
      let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'cities', {
        method: 'POST',
        body: JSON.stringify({
          state_id,
          f: 'site-selection',
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      });
      let data = await res.json();
      if (data && data.features) {
        setCities(data.features);
        let bbox = turf.bbox(data);
        map.fitBounds(bbox, {
          padding: 20,
        });
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
        // map.getSource('village').setData(data);
        let bbox = turf.bbox(data);
        map.fitBounds(bbox, {
          padding: 20,
        });
      }
    }
  };

  const manageSources2 = async () => {
    let features = [];
    if (selectedCities.length > 0) {
      let newlySelectedCities = cities.filter((x) =>
        selectedCities.includes(x.properties.name),
      );
      setIdentifier(newlySelectedCities.map((x) => x.properties.town_cd));
      setLoader(true);
      let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'grids', {
        method: 'POST',
        body: JSON.stringify({
          town_id: newlySelectedCities.map((x) => x.properties.town_cd),
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      });
      let data = await res.json();
      setLoader(false);
      let fc = {
        type: 'FeatureCollection',
        features: [],
      };
      let fc1 = {
        type: 'FeatureCollection',
        features: [],
      };
      data.forEach((x) => {
        fc.features.push({
          id: x.id,
          type: 'feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: cellsToMultiPolygon([x.hexid08], true),
          },
          properties: x,
        });
        fc1.features.push({
          id: x.id,
          type: 'feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: cellsToMultiPolygon([x.hexid08], true),
          },
          properties: {
            hexid: x.hexid08,
            locality: localities.find((y) => y.properties.id == x.locality_id)
              ? localities.find((y) => y.properties.id == x.locality_id)
                  .properties.name
              : 'Not provided',
            city: cities.find((y) => y.properties.town_cd == x.town_cd)
              .properties.name,
            state: states.find((y) => y.properties.id == x.stat_cd).properties
              .name,
            postcode: x.postcode,
          },
        });
      });
      setGrids(fc.features);
      map.getSource('grids').setData(fc);
      map.getSource('hexgrids').setData(fc1);
      features = fc.features;
    }
    if (selectedDistricts.length > 0) {
      let newlySelectedDistricts = districts.filter((x) =>
        selectedDistricts.includes(x.properties.name),
      );
      setIdentifier(newlySelectedDistricts.map((x) => x.properties.dist_cd));
      setLoader(true);
      let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'villages', {
        method: 'POST',
        body: JSON.stringify({
          dist_id: newlySelectedDistricts.map((x) => x.properties.id),
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      });
      let data = await res.json();
      setLoader(false);
      setVillages(data.features);
      let fc = {
        type: 'FeatureCollection',
        features: [],
      };
      data.features.forEach((x) => {
        fc.features.push({
          type: 'feature',
          geometry: x.geometry,
          properties: {
            name: x.properties.name,
            district: districts.find(
              (y) => y.properties.id == x.properties.dist_cd,
            ).properties.name,
            state: states.find((y) => y.properties.id == x.properties.stat_cd)
              .properties.name,
          },
        });
      });
      features = fc.features;
      map.getSource('heatmap').setData(fc);
      map.getSource('villages').setData(fc);
    }
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

  const getIndustries = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'industries');
    setIndustries(await res.json());
  };

  const getStates = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'states');
    let data = await res.json();
    setStates(data.features);
  };

  const getCompetitors = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'competitors');
    setCompetitors(await res.json());
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

    let resFootFall = await fetch(
      publicRuntimeConfig.API_ROOT_URL + 'indicators/' + market + '/footfall',
    );
    setFootfall(await resFootFall.json());
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

  const deleteCompetitor = (dp) => {
    let deletedDp = selectedCompetitors.find((item) => item.indicatr === dp);
    let filteredDP = selectedCompetitors.filter((item) => item.indicatr !== dp);
    setSelectedCompetitors(filteredDP);
    let element = document.getElementById(deletedDp.target);
    if (element && element.checked) {
      element.checked = false;
    }
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

  const deleteCity = (ct) => {
    let filteredCities = selectedCities.filter((city) => city !== ct);
    setSelectedCities(filteredCities);
  };

  const deleteDistrict = (dt) => {
    let filteredDistricts = selectedDistricts.filter(
      (district) => district !== dt,
    );
    setSelectedDistricts(filteredDistricts);
  };

  const showOnMap = async (dp) => {
    debugger;
    if (selectedStates.length > 0) {
      let fc = {
        type: 'FeatureCollection',
        features: [],
      };
      let indicators = [],
        middleIndex,
        ranges = [],
        legend = [],
        interpolate = ['interpolate', ['linear'], ['get', dp.indicatr]];

      if (dp.table_name == 'hexgrid08') {
        if (grids.length > 0) {
          grids.forEach((x) => {
            if (x.properties[dp.indicatr] != null) {
              let state = states.find(
                (y) => y.properties.id === parseInt(x.properties.stat_cd),
              );
              let properties = {
                name: x.properties.name,
                state: state.properties.name,
                // indicator: dp.name,
              };
              properties[dp.indicatr] = x.properties[dp.indicatr];
              let feature = turf.feature(x.geometry);
              feature.properties = properties;
              fc.features.push(feature);
            }
          });
          indicators = [
            ...new Set(
              fc.features.map((x) => {
                if (x.properties[dp.indicatr]) return x.properties[dp.indicatr];
              }),
            ),
          ];
        }
      } else if (dp.table_name == 'village') {
        if (villages.length > 0) {
          villages.forEach((x) => {
            if (x.properties[dp.indicatr] != null) {
              let state = states.find(
                (y) => y.properties.id === x.properties.stat_cd,
              );
              let properties = {
                name: x.properties.name,
                state: state.properties.name,
                // indicator: dp.name,
              };
              properties[dp.indicatr] = x.properties[dp.indicatr];
              var feature = turf.feature(x.geometry);
              feature.properties = properties;
              fc.features.push(feature);
            }
          });

          indicators = [
            ...new Set(
              fc.features.map((x) => {
                if (x.properties[dp.indicatr]) return x.properties[dp.indicatr];
              }),
            ),
          ];
        }
      } else {
        setLoader(true);
        let resDp = await fetch(
          publicRuntimeConfig.API_ROOT_URL + 'site-selection',
          {
            method: 'POST',
            body: JSON.stringify({
              geolevel: selectedMarket,
              table_name: dp.table_name,
              location:
                selectedMarket === 'h8'
                  ? grids.map((x) => x.properties.town_cd)
                  : villages.map((x) => x.properties.id),
            }),
            headers: {
              'content-type': 'application/json',
            },
            redirect: 'follow',
          },
        );
        const data = await resDp.json();
        setLoader(false);

        if (data.length > 0) {
          if (selectedMarket === 'h8') {
            data.forEach((x) => {
              if (x[dp.indicatr] != null) {
                let grid = grids.find((i) => i.id === parseInt(x.hex08_key));
                let state = states.find(
                  (y) =>
                    y.properties.id ===
                    parseInt(
                      grids.find((i) => i.id === parseInt(x.hex08_key))
                        .properties.stat_cd,
                    ),
                );
                let feature = turf.feature(grid.geometry);
                let properties = {
                  name: grid.properties.t_name,
                  state: state.properties.name,
                  // indicator: dp.name,
                };
                properties[dp.indicatr] = x[dp.indicatr];
                feature.properties = properties;
                fc.features.push(feature);
              }
            });
          } else {
            data.forEach((x) => {
              if (x[dp.indicatr] != null) {
                let village = villages.find(
                  (i) => i.properties.id === parseInt(x.village_cd),
                );
                let state = states.find(
                  (y) => y.properties.id === village.properties.stat_cd,
                );
                var feature = turf.feature(village.geometry);
                let properties = {
                  name: village.properties.name,
                  state: state.properties.name,
                  // indicator: dp.name,
                };
                properties[dp.indicatr] = x[dp.indicatr];
                feature.properties = properties;
                fc.features.push(feature);
              }
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
      }

      if (fc.features.length > 0) {
        var array = [...fc.features];
        var filtered = array.filter((el) => el != null);
        filtered.sort(
          (a, b) => b.properties[dp.indicatr] - a.properties[dp.indicatr],
        );
        if (Math.round(filtered.length / 5) < 1) {
          middleIndex = Math.ceil(filtered.length / 5);
        } else {
          middleIndex = Math.round(filtered.length / 5);
        }

        var first = filtered.splice(-middleIndex);
        var second = filtered.splice(-middleIndex);
        var third = filtered.splice(-middleIndex);
        var fourth = filtered.splice(-middleIndex);
        var fifth = filtered;

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
            first[0].properties[dp.indicatr] !=
            second[0].properties[dp.indicatr]
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
            second[0].properties[dp.indicatr] !=
            third[0].properties[dp.indicatr]
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
            third[0].properties[dp.indicatr] !=
            fourth[0].properties[dp.indicatr]
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
            fourth[0].properties[dp.indicatr] !=
            fifth[0].properties[dp.indicatr]
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
        // interpolate.push('rgb(255,255,255)');
        if (selectedMarket == 'h8') {
          map.getSource('hexgrids').setData(fc);
          map.setPaintProperty('hexgrids', 'fill-opacity', 0.4);
          map.setPaintProperty('hexgrids', 'fill-outline-color', interpolate);
          map.setPaintProperty('hexgrids', 'fill-color', interpolate);
        } else {
          map.getSource('heatmap').setData(fc);
          map.setPaintProperty('heatmap', 'fill-opacity', 0.4);
          map.setPaintProperty('heatmap', 'fill-outline-color', interpolate);
          map.setPaintProperty('heatmap', 'fill-color', interpolate);
        }
      } else {
        toast.error('No data is available to show on map');
      }
    }
  };

  return (
    <>
      {loader && <Loader />}
      <ToastContainer position="top-center" theme="colored" />
      <div className={'subMenu ' + className}>
        <span
          onClick={close}
          className="fixed ml-10 cursor-pointer icon-cancel top-2 left-80"
        ></span>
        <div className={rankData ? 'hidden' : ''}>
          {!rankData && <SearchArea className="mb-6" />}

          <h3 className="flex items-center justify-between mb-4 text-base font-medium">
            Site Selection{' '}
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
          <div className="flex justify-between mb-6">
            <button
              className={`btnTab ${selectedMarket === 'h8' && 'active'}`}
              onClick={() => setSelectedMarket('h8')}
            >
              Urban
            </button>
            <button
              className={`btnTab ${selectedMarket === 'village' && 'active'}`}
              onClick={() => setSelectedMarket('village')}
            >
              Rural
            </button>
          </div>

          {selectedMarket === 'h8' && selectedStates.length !== 0 && (
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
                : 'Loading...'}
              <span className="absolute icon-rght-arrow right-3 top-3"></span>
            </div>
          )}

          {selectedMarket === 'h8' && selectedCities.length !== 0 && (
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
                : 'Loading...'}
              <span className="absolute icon-rght-arrow right-3 top-3"></span>
            </div>
          )}

          {selectedMarket === 'village' && selectedStates.length !== 0 && (
            <div
              className={
                'dropRight ' +
                (!districts.length ? 'opacity-30 pointer-events-none' : '')
              }
              title="District"
              onMouseOver={showDD}
            >
              {selectedDistricts.length
                ? selectedDistricts.join(', ')
                : districts.length
                ? 'Select District'
                : 'Loading...'}
              <span className="absolute icon-rght-arrow right-3 top-3"></span>
            </div>
          )}

          {(selectedMarket === 'h8' && selectedCities.length > 0) ||
          (selectedMarket === 'village' && selectedDistricts.length > 0) ? (
            <>
              <hr className="my-6 border-primary1" />

              <h3 className="mb-4 text-base font-medium">Data Layers</h3>

              <ul className="-mx-4 2xl:-mx-6 menuUl">
                {permission.socioeconomics && (
                <li title="Socioeconomic" onMouseOver={showDD}>
                  Socioeconomic <span className="icon-rght-arrow"></span>
                </li>
                 )}
                {permission.demography && (
                <li title="Demography" onMouseOver={showDD}>
                  Demography <span className="icon-rght-arrow"></span>
                </li>
                 )}
                {permission.customer_segment && (
                <li title="Customer Segmentation" onMouseOver={showDD}>
                  Customer Segmentation{' '}
                  <span className="icon-rght-arrow"></span>
                </li>
                 )}
                {permission.poi && (
                <li title="Points of Interest" onMouseOver={showDD}>
                  Points of Interest <span className="icon-rght-arrow"></span>
                </li>
                 )}
                {permission.infrastructure && (
                <li title="Infrastructure" onMouseOver={showDD}>
                  Infrastructure <span className="icon-rght-arrow"></span>
                </li>
                 )}
                {permission.digital_penetration && (
                <li title="Digital Penetration" onMouseOver={showDD}>
                  Digital Penetration <span className="icon-rght-arrow"></span>
                </li>
                 )}
                {permission.footfall && (
                <li title="Footfall" onMouseOver={showDD}>
                  Footfall <span className="icon-rght-arrow"></span>
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
                      onClick={() =>
                        deleteDataPoint(select.name)
                      }
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
            features={selectedMarket === 'h8' ? grids : villages}
            districts={districts}
            localities={localities}
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

        <GeoMultiSelectMenu
          show={selectedDD === 'District'}
          options={districts}
          selectedOpts={selectedDistricts}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => setSelectedDD('')}
          selected={(district) => {
            Array.isArray(district)
              ? setSelectedDistricts(district)
              : setSelectedDistricts([...selectedDistricts, district]);
          }}
          deleted={deleteDistrict}
          ref={resetDistrictSearch}
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

        {permission.footfall && (
        <MultiSelectMenu
          show={selectedDD === 'Footfall'}
          options={footfall}
          selectedOpts={selectedDataPoint}
          offset={offset}
          mouseLeave={() => setSelectedDD('')}
          selected={(selectedDP) =>
            setSelectedDataPoint([...selectedDataPoint, selectedDP])
          }
          deleted={deleteDataPoint}
          ref={resetFootfallSearch}
        />
        )}
      </div>

      <ResultPanelSS
        graphData={graphData}
        selectedMarket={selectedMarket}
        features={selectedMarket === 'h8' ? grids : villages}
        states={states}
        localities={localities}
        districts={districts}
        isOpen={showResults}
        close={() => setShowResults(false)}
        ref={resetSelected}
      />
      <Legend indicator={indicator} legends={legends} />
    </>
  );
}

export default SiteSelection;
