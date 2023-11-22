import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchArea from './SearchArea';
import useMapStore from '../../stores/useMapStore';
import * as turf from '@turf/turf';
import getConfig from 'next/config';
import RankData from './RankData';
import ResultPanelCS from '../result_panel/ResultPanelCS';
import Legend from '../map_components/Legend';
import CompareSite from '../result_panel/CompareSite';
import { cellsToMultiPolygon } from 'h3-js';
import GeoMultiSelectMenu from '../popOutMenu/GeoMultiSelectMenu';
import MultiSelectMenu from '../popOutMenu/MultiSelectMenu';
import MultiLevelMenu from '../popOutMenu/MultiLevelMenu';
import SingleSelectMenu from '../popOutMenu/SingleSelectMenu';
import Loader from '../Loader';
const { publicRuntimeConfig } = getConfig();

function CustomerSegmentation({ className }) {
  const mktExpDdCheckBox = useRef();
  const resetStateSearch = useRef();
  const resetCitySearch = useRef();
  const resetLocSearch = useRef();
  const resetCSSearch = useRef();
  const map = useMapStore((state) => state.map);
  const [selectedDD, setSelectedDD] = useState();
  const [offset, setOffset] = useState();
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
  const [selectedLocalities, setSelectedLocalities] = useState([]);
  const [industries, setIndustries] = useState();
  const [industry, setIndustry] = useState('Industry');
  const [socioeconomic, setSocioeconomic] = useState();
  const [demography, setDemography] = useState();
  const [customerSegmentation, setCustomerSegmentation] = useState();
  const [CSLevels, setCSLevels] = useState({});
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
  const [filter, setFilter] = useState([
    { Age: [] },
    { Gender: [] },
    { Affluence: [] },
  ]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(0);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  const [treemapData, setTreemapData] = useState();
  const [selectedGraph, setSelectedGraph] = useState('graph');
  const [minVal, setMinVal] = useState();
  const [maxVal, setMaxVal] = useState();
  const minValRef = useRef();
  const maxValRef = useRef();
  const range = useRef(null);

  const resetResult = () => {
    setTimeout(() => {
      setSelectedGraph('graph');
    }, 500);
  };

  useEffect(() => {
    setTreemapData();
    setShowResults(false);
    resetResult();
  }, [selectedDataPoint]);

  useEffect(() => {
    if (!map) return;
    map.getSource('heatmap').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('hexgrids').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('boundary').setData({
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
    map.setFilter('hex-highlighted', ['==', 'name', '']);
    map.setFilter('heat-highlighted', ['==', 'village_cd', '']);
    setGrids([]);
    setVillages([]);
    getStates();
    getSegmentConsumers();
    map.flyTo({ center: [78.626598, 22.838084], zoom: 4 });
  }, []);

  useEffect(() => {
    map.getSource('boundary').setData({
      type: 'FeatureCollection',
      features: [],
    });
    manageSources3();
  }, [selectedLocalities]);

  const manageSources3 = async () => {
    if (selectedLocalities.length > 0) {
      let newlySelectedLocalities = localities.filter((x) =>
        selectedLocalities.includes(x.properties.name),
      );
      let features = newlySelectedLocalities;
      let fc = {
        type: 'FeatureCollection',
        features: [],
      };
      features.forEach((x) => {
        fc.features.push({
          type: 'feature',
          geometry: x.geometry,
          properties: x.properties,
        });
      });
      map.getSource('boundary').setData(fc);
      if (features) {
        let bbox = turf.bbox({
          type: 'FeatureCollection',
          features: features,
        });
        map.fitBounds(bbox, {
          padding: 20,
        });
      }
    }
  };

  useEffect(() => {
    if (selectedStates.length == 0 || !map) return;
    manageSources();
    return () => {
      setCities([]);
      setSelectedDataPoint([]);
      setSelectedCities([]);
      setSelectedLocalities([]);
      setDistricts([]);
      setSelectedDistricts([]);
      setSliderMin(0);
      setSliderMax(0);
      setLegends([]);
      setIndicator();
      setTreemapData();
    };
  }, [selectedStates]);

  useEffect(() => {
    if (selectedCities.length == 0 || !map) return;
    manageSources2();
    getLocalities();
    return () => {
      setLegends([]);
      setIndicator();
      setSliderMin(0);
      setSliderMax(0);
      setGrids([]);
      setVillages([]);
      setLocalities([]);
      setSelectedLocalities([]);
      setSelectedDataPoint([]);
      setShowResults(false);
      resetResult();
      setTreemapData();
      map.getSource('heatmap').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('hexgrids').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('boundary').setData({
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
  }, [selectedCities]);

  useEffect(() => {
    setMinVal(sliderMin);
    setMaxVal(sliderMax);
    minValRef.current = sliderMin;
    maxValRef.current = sliderMax;
  }, [sliderMin, sliderMax]);

  const getPercent = useCallback(
    (value) =>
      Math.round(((value - sliderMin) / (sliderMax - sliderMin)) * 100),
    [sliderMin, sliderMax],
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  const mapVisualisation = async (selectedDP) => {
    setLoader(true);
    setSelectedDataPoint(selectedDP);
    await fetch(publicRuntimeConfig.API_ROOT_URL + 'segment-consumer', {
      method: 'POST',
      body: JSON.stringify({
        city: selectedCities[0],
        catg_one: CSLevels.catg_one,
        catg_two: CSLevels.catg_two,
        catg_three: selectedDP,
        locality: '',
        segmtFilter: 1,
      }),
      headers: {
        'content-type': 'application/json',
        Connection: 'keep-alive',
      },
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        setLoader(false);
        Array.prototype.max = function() {
          return Math.max.apply(null, this);
        };
        
        Array.prototype.min = function() {
          return Math.min.apply(null, this);
        };
        const arr = []
        result.forEach((x) => {
          arr.push(x.consumer_digital_expenditure);
        });
        setSliderMax(arr.max());
        setSliderMin(arr.min());
        let graphArray = [];
        result.map((x) => {
          graphArray.push({
            x: x.name,
            y: x.smtii0001,
          });
        });
        setGraphData(graphArray);
        let fc = {
          type: 'FeatureCollection',
          features: [],
        };
        let avgofcatg = 0;
        let i = 0;
        result.forEach((x) => {
          i = i + 1;
          avgofcatg = avgofcatg + x.smtii0001;
          fc.features.push({
            id: x.id,
            type: 'feature',
            geometry: {
              type: 'MultiPolygon',
              coordinates: cellsToMultiPolygon([x.name], true),
            },
            properties: x,
          });
        });
        let array = [...fc.features],
          ranges = [],
          legend = [],
          indicators = [],
          middleIndex,
          interpolate = ['interpolate', ['linear'], ['get', 'smtii0001']];
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
          value: first[0].properties.smtii0001,
          color: 'rgba(230,230,230,0.8)',
        });
        legend.push({
          to: first[0].properties.smtii0001,
          from: first[first.length - 1].properties.smtii0001,
          color: 'rgb(230,230,230)',
        });
        if (first.length > 0 && second.length > 0) {
          if (first[0].properties.smtii0001 != second[0].properties.smtii0001) {
            ranges.push({
              value: second[0].properties.smtii0001,
              color: 'rgba(208,161,214,0.8)',
            });
            legend.push({
              to: second[0].properties.smtii0001,
              from: second[second.length - 1].properties.smtii0001,
              color: 'rgb(208,161,214)',
            });
          }
        }
        if (second.length > 0 && third.length > 0) {
          if (second[0].properties.smtii0001 != third[0].properties.smtii0001) {
            ranges.push({
              value: third[0].properties.smtii0001,
              color: 'rgba(213,100,200,0.8)',
            });
            legend.push({
              to: third[0].properties.smtii0001,
              from: third[third.length - 1].properties.smtii0001,
              color: 'rgb(213,100,200)',
            });
          }
        }
        if (third.length > 0 && fourth.length > 0) {
          if (third[0].properties.smtii0001 != fourth[0].properties.smtii0001) {
            ranges.push({
              value: fourth[0].properties.smtii0001,
              color: 'rgba(221,19,192,0.8)',
            });
            legend.push({
              to: fourth[0].properties.smtii0001,
              from: fourth[fourth.length - 1].properties.smtii0001,
              color: 'rgb(221,19,192)',
            });
          }
        }
        if (fourth.length > 0 && fifth.length > 0) {
          if (fourth[0].properties.smtii0001 != fifth[0].properties.smtii0001) {
            ranges.push({
              value: fifth[0].properties.smtii0001,
              color: 'rgba(136,0,228,0.8)',
            });
            legend.push({
              to: fifth[0].properties.smtii0001,
              from: fifth[fifth.length - 1].properties.smtii0001,
              color: 'rgb(136,0,228)',
            });
          }
        }

        setLegends(legend);
        setIndicator({ name: selectedDP, unit: 'Percent' });
        ranges.map((x) => {
          interpolate.push(x.value);
          interpolate.push(x.color);
        });
        map.getSource('heatmap').setData(fc);
        map.setPaintProperty('heatmap', 'fill-opacity', 0.4);
        map.setPaintProperty('heatmap', 'fill-outline-color', interpolate);
        map.setPaintProperty('heatmap', 'fill-color', interpolate);
        map.getSource('hexgrids').setData({
          type: 'FeatureCollection',
          features: [],
        });
      })
      .catch((error) => console.log('error', error));
  };

  const restSelected = () => {
    resetStateSearch.current.resetSearch();
    resetCitySearch.current.resetSearch();
    if(selectedCities.length>0) {
      resetCSSearch.current.resetSearch();
      resetLocSearch.current.resetSearch();
    }
    setLegends([]);
    setIndicator();
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedLocalities([]);
    setSelectedDataPoint([]);
    setSliderMin(0);
    setSliderMax(0);
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
    map.getSource('hexgrids').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('boundary').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('grids').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('heatmap').setData({
      type: 'FeatureCollection',
      features: [],
    });
    map.getSource('boundary').setData({
      type: 'FeatureCollection',
      features: [],
    });
    setShowResults(false);
    resetResult();
    setTreemapData();
  };

  const manageSources = async () => {
    let state_id = states
      .filter((x) => selectedStates.includes(x.properties.name))
      .map((x) => x.properties.id);
      let res = await fetch('/api/' + 'cities', {
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
  };

  const manageSources2 = async () => {
    let features = [];
    if (selectedCities.length > 0) {
      let newlySelectedCities = cities.filter((x) =>
        selectedCities.includes(x.properties.name),
      );
      setIdentifier(newlySelectedCities.map((x) => x.properties.town_cd));
      features = newlySelectedCities;
      let res = await fetch('/api/' + 'grids', {
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
      let fc = {
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
      });
      setGrids(fc.features);
      map.getSource('grids').setData(fc);
      map.getSource('hexgrids').setData(fc);
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

  const getStates = async () => {
    let res = await fetch('/api/' + 'states');
    let data = await res.json();
    setStates(data.features);
  };

  const getLocalities = async () => {
    let res = await fetch('/api/' + 'localities', {
      method: 'POST',
      body: JSON.stringify({
        cities: selectedCities,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    let data = await res.json();
    setLocalities(data.features);
  };

  const deleteDataPoint = (dp) => {
    let deletedDp = selectedDataPoint.find((item) => item.indicatr === dp);
    let filteredDP = selectedDataPoint.filter((item) => item.indicatr !== dp);
    setSelectedDataPoint(filteredDP);
    setLegends([]);
    setIndicator();
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

  const deleteLocality = (lc) => {
    let filteredLocalities = selectedLocalities.filter(
      (locality) => locality !== lc,
    );
    setSelectedLocalities(filteredLocalities);
  };

  async function getSegmentConsumers() {
    let resCS = await fetch(
      '/api/' + 'indicators/' + 'h8' + '/customer-segmentation',
    );
    setCustomerSegmentation(await resCS.json());
  }

  async function changeSlider(e, value) {
    let min = minVal;
    let max = maxVal;
    if (e.target.name==='min') {
      min = value;
    }
    else if (e.target.name==='max') {
      max = value;
    }
    await fetch('/api/' + 'segment-consumer', {
      method: 'POST',
      body: JSON.stringify({
        city: selectedCities[0],
        catg_one: CSLevels.catg_one,
        catg_two: CSLevels.catg_two,
        catg_three: selectedDataPoint,
        locality: '',
        segmtFilter: 1,
      }),
      headers: {
        'content-type': 'application/json',
        Connection: 'keep-alive',
      },
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        let fc = {
          type: 'FeatureCollection',
          features: [],
        };
        result.forEach((x) => {
          if (x.consumer_digital_expenditure <= max && x.consumer_digital_expenditure >= min) {
            fc.features.push({
              id: x.id,
              type: 'feature',
              geometry: {
                type: 'MultiPolygon',
                coordinates: cellsToMultiPolygon([x.name], true),
              },
              properties: x,
            });
          }
        });
        let filteredFeatures = fc.features.filter((data) => {
          return (data.properties.consumer_digital_expenditure <= max && data.properties.consumer_digital_expenditure >= min);
        });
        let graphArray = [];
        filteredFeatures.map((x) => {
          graphArray.push({
            x: x.properties.name,
            y: x.properties.smtii0001,
          });
        });
        setGraphData(graphArray);
        let array = [...filteredFeatures],
          ranges = [],
          middleIndex,
          interpolate = ['interpolate', ['linear'], ['get', 'smtii0001']];
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
          value: first[0].properties.smtii0001,
          color: 'rgba(230,230,230,0.8)',
        });
        if (first.length > 0 && second.length > 0) {
          if (first[0].properties.smtii0001 != second[0].properties.smtii0001) {
            ranges.push({
              value: second[0].properties.smtii0001,
              color: 'rgba(208,161,214,0.8)',
            });
          }
        }
        if (second.length > 0 && third.length > 0) {
          if (second[0].properties.smtii0001 != third[0].properties.smtii0001) {
            ranges.push({
              value: third[0].properties.smtii0001,
              color: 'rgba(213,100,200,0.8)',
            });
          }
        }
        if (third.length > 0 && fourth.length > 0) {
          if (third[0].properties.smtii0001 != fourth[0].properties.smtii0001) {
            ranges.push({
              value: fourth[0].properties.smtii0001,
              color: 'rgba(221,19,192,0.8)',
            });
          }
        }
        if (fourth.length > 0 && fifth.length > 0) {
          if (fourth[0].properties.smtii0001 != fifth[0].properties.smtii0001) {
            ranges.push({
              value: fifth[0].properties.smtii0001,
              color: 'rgba(136,0,228,0.8)',
            });
          }
        }
        ranges.map((x) => {
          interpolate.push(x.value);
          interpolate.push(x.color);
        });
          map.getSource('heatmap').setData(fc);
          map.setPaintProperty('heatmap', 'fill-opacity', 0.4);
          map.setPaintProperty('heatmap', 'fill-outline-color', interpolate);
          map.setPaintProperty('heatmap', 'fill-color', interpolate);
      })
      .catch((error) => console.log('error', error));
  }

  function showResult() {
    setShowResults(true);
  }

  const showDD = (e) => {
    let position = e.target.getBoundingClientRect();
    setOffset({
      top: position.top,
      left: position.left + position.width + 10,
    });
    setSelectedDD(e.target.title);
  };

  return (
    <>
      <div className={'subMenu ' + className}>
        <span
          onClick={close}
          className="fixed ml-10 cursor-pointer icon-cancel top-2 left-80"
        ></span>
        <div>
          <SearchArea className="mb-6" />

          <h3 className="flex items-center justify-between mb-4 text-base font-medium">
            Customer Segmentation{' '}
            <span
              title="Reset"
              className="transition-all ease-in-out cursor-pointer icon-history text-primary1 hover:text-white"
              onClick={restSelected}
            ></span>
          </h3>
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
          <div
            className={
              'dropRight ' +
              (!cities.length ? 'opacity-30 pointer-events-none' : '')
            }
            id="cities"
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
          {selectedCities.length > 0 && (
            <>
              <div
                className={
                  'dropRight ' +
                  (!localities.length ? 'opacity-30 pointer-events-none' : '')
                }
                id="locality"
                title="Locality"
                onMouseOver={showDD}
              >
                {selectedLocalities.length
                  ? selectedLocalities.join(', ')
                  : localities.length
                  ? 'Locality'
                  : 'Loading...'}
                <span className="absolute icon-rght-arrow right-3 top-3"></span>
              </div>
              <div
                className={
                  'dropRight ' +
                  (!customerSegmentation
                    ? 'opacity-30 pointer-events-none'
                    : '')
                }
                id="segmentConsumers"
                title="Customer Segmentation"
                onMouseOver={showDD}
              >
                {selectedDataPoint.length
                  ? selectedDataPoint
                  : customerSegmentation
                  ? 'Segment Consumers'
                  : 'Loading...'}
                <span className="absolute icon-rght-arrow right-3 top-3"></span>
              </div>
              <div
                className={
                  'dropRight ' +
                  (!filter.length ? 'opacity-30 pointer-events-none' : '')
                }
                id="filer"
                title="Filter"
                onMouseOver={showDD}
              >
                {selectedFilter.length
                  ? selectedFilter.join(', ')
                  : filter
                  ? 'Select a filter'
                  : 'Loading...'}
                <span className="absolute icon-rght-arrow right-3 top-3"></span>
              </div>
              <div className="mt-10 mb-5 rounded-md">
                <div className="flex justify-between mt-3">
                  <h3 className="mb-4 text-s">Digital Expenditure</h3>
                    {minVal === maxVal
                      ? <h3 className="text-xs text-primary1">₹ {minVal.toLocaleString()}</h3>
                      : 
                      <div>
                        <h3 className="text-xs text-primary1">₹ {minVal.toLocaleString()} -</h3>
                        <h3 className="mb-3 text-xs text-primary1">{maxVal.toLocaleString()}</h3>
                      </div>}
                </div>
                <input
                name='min'
                  type="range"
                  min={sliderMin}
                  step="20000"
                  max={sliderMax}
                  value={minVal}
                  onChange={(event) => {
                    const value = Math.min(
                      Number(event.target.value),
                      maxVal - 1,
                    );
                    setMinVal(value);
                    minValRef.current = value;
                    changeSlider(event, value);
                  }}
                  className="thumb thumbLeft"
                  style={{ zIndex: minVal > sliderMax - 100 && '5' }}
                />
                <input
                  name='max'
                  type="range"
                  min={sliderMin}
                  step="20000"
                  max={sliderMax}
                  value={maxVal}
                  onChange={(event) => {
                    const value = Math.max(
                      Number(event.target.value),
                      minVal + 1,
                    );
                    setMaxVal(value);
                    maxValRef.current = value;
                    changeSlider(event, value);
                  }}
                  className="thumb thumbRight"
                />

                <div className="relative w-full">
                  <div className="sliderTrack" />
                  <div ref={range} className="sliderRange" />
                </div>
                <ul className="flex justify-between mt-5 text-xs text-primary">
                  <li>₹ {sliderMin.toLocaleString()}</li>
                  <li>₹ {sliderMax.toLocaleString()}</li>
                </ul>
              </div>
            </>
          )}
          <button
            disabled={selectedDataPoint.length > 0 ? false : true}
            className="w-full my-4 btn-primary"
            onClick={showResult}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        ref={mktExpDdCheckBox}
        className={className + (rankData ? ' hidden' : '')}
      >
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
          mouseLeave={() => {
            setSelectedDD('');
          }}
          selected={(city) => {
            Array.isArray(city)
              ? setSelectedCities(city)
              : setSelectedCities([...selectedCities, city]);
          }}
          deleted={deleteCity}
          ref={resetCitySearch}
        />
        <GeoMultiSelectMenu
          show={selectedDD === 'Locality'}
          options={localities}
          selectedOpts={selectedLocalities}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => {
            setSelectedDD('');
          }}
          selected={(locality) => {
            Array.isArray(locality)
              ? setSelectedLocalities(locality)
              : setSelectedLocalities([...selectedLocalities, locality]);
          }}
          deleted={deleteLocality}
          ref={resetLocSearch}
        />
        <MultiLevelMenu
          show={selectedDD === 'Customer Segmentation'}
          hide={() => setSelectedDD('')}
          options={customerSegmentation}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => {
            setSelectedDD('');
          }}
          categories={(cat1, cat2) => {
            setCSLevels({
              catg_one: cat1,
              catg_two: cat2,
            });
          }}
          selected={(selectedDP) => {
            setSelectedDataPoint(selectedDP);
            mapVisualisation(selectedDP);
          }}
          deleted={deleteDataPoint}
          subLevel={3}
          ref={resetCSSearch}
        />
        <MultiSelectMenu
          show={selectedDD === 'Filter'}
          options={filter}
          selectedOpts={selectedFilter}
          offset={{ top: offset?.top, left: offset?.left + 25 }}
          mouseLeave={() => setSelectedDD('')}
          selected={(selectedDP) => {
            setSelectedFilter([...selectedFilter, selectedDP]);
          }}
          deleted={deleteDataPoint}
          subLevel={3}
        />
      </div>
      <ResultPanelCS
        graphData={graphData}
        selectedDataPoint={selectedDataPoint}
        features={grids}
        states={states}
        localities={localities}
        isOpen={showResults}
        close={() => {
          setShowResults(false);
          resetResult();
        }}
        treeData={treemapData}
        setTreeData={setTreemapData}
        selectedOutput={selectedGraph}
        setSelectedOutput={setSelectedGraph}
      />
      {loader && <Loader />}
      <Legend indicator={indicator} legends={legends} />
    </>
  );
}

export default CustomerSegmentation;
