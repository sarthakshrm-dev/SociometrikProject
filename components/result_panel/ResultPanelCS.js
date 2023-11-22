// import mapboxgl from 'mapbox-gl';
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import mapboxgl from '!mapbox-gl';
import * as turf from '@turf/turf';
import useMapStore from '../../stores/useMapStore';
import { XYPlot, YAxis, VerticalBarSeries, Hint, ChartLabel } from 'react-vis';
import 'react-vis/dist/style.css';
import dynamic from 'next/dynamic';
import CompareSite from './CompareSite';
import getConfig from 'next/config';
import { data } from 'autoprefixer';
import Accordion from '../Accordion';
import Loader from '../Loader';
import { Treemap } from 'react-vis';
const { publicRuntimeConfig } = getConfig();

const ResultPanelSS = forwardRef(
  (
    {
      graphData,
      selectedMarket,
      features,
      states,
      localities,
      districts,
      isOpen,
      close,
      treeData,
      setTreeData,
      setSelectedOutput,
      selectedOutput,
    },
    ref,
  ) => {
    const graphWidth = useRef();
    const map = useMapStore((state) => state.map);
    const [width, setWidth] = useState();
    const [value, setValue] = useState();
    const [pagenatedData, setPagenatedData] = useState([]);
    const [pageNo, setPageNo] = useState(0);
    const [currentData, setCurrentData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [mapClick, setMapClick] = useState(false);
    const [doCompare, setDoCompare] = useState(false);
    const [metric, setMetric] = useState({});
    const [hex, setHex] = useState();
    const [treemapL1, setTreemapL1] = useState();
    const [treemapL2, setTreemapL2] = useState();
    const [treemapL3, setTreemapL3] = useState();
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const [hoverNode, setHoverNode] = useState(false);
    const [treeParent, setTreeParent] = useState({});
    const [pop, setPop] = useState(false);
    const [popPosition, setPopPosition] = useState({ x: '', y: '' });
    const popup = useRef();

    useEffect(() => {
      if (!treeData) {
        setTreemapL1();
        setTreemapL2();
        setTreemapL3();
      }
    }, [treeData]);

    useEffect(() => {
      setTreemapL2();
      setTreemapL3();
    }, [hex]);

    useEffect(() => {
      const handleMouseMove = (event) => {
        setPopPosition({ x: event.clientX, y: event.clientY });
        if (popup.current) {
          popup.current.style.left = `${popPosition.x + 20}px`;
          popup.current.style.top = `${popPosition.y - 20}px`;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
    }, [popPosition]);

    useEffect(() => {
      setWidth(graphWidth.current.offsetWidth);
      return () => {
        setWidth();
      };
    }, []);

    useEffect(() => {
      if (graphData.length == 0) return;
      let data = [];
      if (graphData.length > 10) {
        data = paginate(graphData, 10);
      } else {
        data = [graphData];
      }
      setPagenatedData(data);
      setCurrentData(data[0]);
      setPageNo(0);
    }, [graphData]);

    useEffect(() => {
      if (pagenatedData.length == 0) return;
      setCurrentData(pagenatedData[pageNo]);
    }, [pageNo]);

    useEffect(() => {
      if (!map) return;
      if (mapClick) map.on('click', addLocation);
      return () => {
        map.off('click', addLocation);
      };
    }, [mapClick]);

    useEffect(() => {
      if (selectedOutput == 'treemap') {
        map.on('click', gridSelection);
      }
    }, [selectedOutput]);

    const gridSelection = async (e) => {
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
            if (['name'].includes(x)) {
              try {
                content =
                  typeof properties[x] === 'string' ||
                  properties[x] instanceof String
                    ? properties[x]
                    : parseFloat(properties[x].toFixed(2)).toLocaleString();
              } catch (e) {
                // debugger
              }
            }
          });
          setHex(content);
          setLoader(true);
          await fetch('/api/' + 'treeMap', {
            method: 'POST',
            body: JSON.stringify({
              hexid08: content,
            }),
            headers: {
              'content-type': 'application/json',
            },
            redirect: 'follow',
          })
            .then((response) => response.json())
            .then((result) => {
              result.children.reverse();
              result.children.map((x) => {
                x.children.reverse();
                x.children.map((y) => {
                  y.children.reverse();
                })
              })
              let a = 0;
              result.children.map((x) => {
                if (x.size == 0) {
                  a = a + 1;
                }
              });
              if (a === 6) {
                setError('No data found for the selected location');
              } else {
                setError(null);
              }
              let treeData = {
                title: 'Customer Segments',
                color: 1,
                children: [],
              };
              result.children.map((data) => {
                treeData.children.push({
                  name: data.name,
                  size: data.size,
                  color: data.size,
                  subChilldren: data.children,
                });
              });
              setTreeData(treeData);
              setTreemapL1(treeData);
            });
          setLoader(false);
        }
      }
    };

    const paginate = (arr, size) => {
      return arr.reduce((acc, val, i) => {
        let idx = Math.floor(i / size);
        let page = acc[idx] || (acc[idx] = []);
        page.push(val);

        return acc;
      }, []);
    };

    const addLocation = (e) => {
      // const coordinates = e.lngLat;
      // storeLocation(coordinates);
      const feature = map
        .queryRenderedFeatures(e.point)
        .find((x) => ['villages', 'grids'].includes(x.layer.id));
      let state = states.find(
        (element) => element.properties.id == feature.properties.stat_cd,
      );
      let f = turf.feature(feature.geometry);
      f.properties = feature.properties;
      f.properties['state'] = state.properties.name;
      // if (feature.properties.locality_id) {
      //   let locality = localities.find(
      //     (x) => x.properties.id === parseInt(feature.properties.locality_id),
      //   );
      //   f.properties['locality'] = locality.properties.name;
      // }
      f.properties['locality'] = 'Dummy';
      map.setFilter('hex-highlighted', [
        '==',
        'hexid08',
        feature.properties.hexid08,
      ]);
      setMapClick(false);
      if (feature) setLocations([...locations, f]);
      let bbox = turf.bbox({
        type: 'FeatureCollection',
        features: [f],
      });
      map.fitBounds(bbox, {
        padding: 20,
      });
    };

    function leafClick(x) {
      if (!treemapL3) {
        const subChild = {
          title: x.name,
          color: 1,
          children: [],
        };
        x.subChilldren.map((y) => {
          subChild.children.push({
            name: y.name,
            size: y.size,
            color: y.size,
            subChilldren: y.children,
          });
        });
        if (!treemapL2) {
          setTreeData(subChild);
          setTreemapL2(subChild);
        } else {
          setTreeData(subChild);
          setTreemapL3(subChild);
        }
      }
    }

    const treeProps = {
      data: treeData,
      onLeafMouseOver: (x) => {
        setHoverNode(x);
        setPop(true);
      },
      onLeafMouseOut: () => setPop(false),
      onLeafClick: (x) => leafClick(x.data),
      height: 220,
      mode: 'squarify',
      getLabel: (x) => x.name,
      width: 750,
      colorRange: ['#E6E6E6', '#8800E4'],
      colorDomain: [0, 100],
      margin: 0,
    };

    return (
      <>
        <div
          className={
            'absolute z-50 bg-gradient-to-b from-dark4 to-dark3 rounded-md p-2 w-max ' +
            `${pop === false && ' hidden'}`
          }
          ref={popup}
        >
          {hoverNode && (
            <>
              <p>
                {hoverNode.data.name} : {Math.floor(hoverNode.data.size)}%
              </p>
            </>
          )}
        </div>
        <div
          className={`fixed 2xl:left-96 left-72 max-w-4xl right-10 transition-all ease-in-out ${
            isOpen
              ? 'opacity-100 bottom-10 visible z-[1]'
              : 'opacity-0 -bottom-72 invisible -z-10'
          }`}
        >
          <span className="inline-block px-3 py-1 ml-3 text-lg bg-primary1 rounded-t-md">
            {' '}
            Results Panel{' '}
            <span
              className="ml-2 text-white cursor-pointer icon-cancel hover:text-red-500"
              onClick={close}
            ></span>
          </span>
          <div
            className={
              selectedOutput === 'treemap'
                ? 'flex rounded-lg bg-gradient-to-b from-dark4 to-dark3 w-fit'
                : 'flex rounded-lg bg-gradient-to-b from-dark4 to-dark3'
            }
          >
            <div className="p-5 basis-8/12" ref={graphWidth}>
              <div className="flex items-center">
                <h2
                  className={
                    'text-base font-medium text-primary1 mr-8 cursor-pointer hover:underline ' +
                    `${selectedOutput === 'graph' && ' underline'}`
                  }
                  onClick={() => {
                    setSelectedOutput('graph');
                  }}
                >
                  Top Locations
                </h2>
                <h2
                  className={
                    'text-base font-medium text-primary1 cursor-pointer hover:underline ' +
                    `${selectedOutput === 'treemap' && ' underline'}`
                  }
                  onClick={() => {
                    setSelectedOutput('treemap');
                  }}
                >
                  Tree Map Output
                </h2>
              </div>

              <div className="h-60">
                {selectedOutput === 'graph' && (
                  <XYPlot width={width} height={240} yDomain={[0,110]} xType="ordinal">
                    <ChartLabel
                      text="Locations"
                      className="alt-x-label"
                      includeMargin={false}
                      xPercent={0.5}
                      yPercent={1.2}
                    />
                    <ChartLabel
                      text="Customer segment percentage"
                      className="alt-y-label"
                      xPercent={0.01}
                      yPercent={0.2}
                      style={{
                        transform: 'rotate(-90)',
                        textAnchor: 'end',
                      }}
                    />
                    <YAxis hideLine top={0} tickValues={[0,25,50,75,100]} />
                    <VerticalBarSeries
                      color="#7B44C7"
                      onValueMouseOver={(datapoint, event) => {
                        setValue(datapoint);
                        let feature = features.find(
                          (x) =>
                            x.properties.hexid08 === datapoint.x.split(',')[0],
                        );
                        map.setFilter("heat-highlighted", [
                          '==',
                          'name',
                          feature.properties.hexid08,
                        ]);
                        if (feature) {
                          setMetric({
                            male: feature.properties.male_population.toLocaleString(),
                            female:
                              feature.properties.female_population.toLocaleString(),
                            female_age:
                              feature.properties.female_population.toLocaleString(),
                            kids: feature.properties.kids_population.toLocaleString(),
                            youth:
                              feature.properties.youth_population.toLocaleString(),
                            elderly:
                              feature.properties.elderly_population.toLocaleString(),
                            affluence: feature.properties.affluence,
                          });
                        }
                      }}
                      onValueMouseOut={(datapoint, event) => {
                        setValue();
                        map.setFilter('heat-highlighted', ['==', 'name', '']);
                      }}
                      onValueClick={(datapoint, event) => {
                        let fc = {
                          type: 'FeatureCollection',
                          features: features.filter((element) => {
                            return (
                              element.properties.hexid08 ===
                              datapoint.x.split(',')[0]
                            );
                          }),
                        };
                        let bbox = turf.bbox(fc);
                        map.fitBounds(bbox, {
                          padding: 20,
                        });
                      }}
                      data={currentData}
                    />
                    {value ? (
                      <Hint value={value}>
                        <div className="px-2 py-1 transition-all ease-in-out border rounded shadow bg-dark2 border-primary2">
                          <p>
                            {value.x}, {value.y}%
                          </p>
                        </div>
                      </Hint>
                    ) : null}
                  </XYPlot>
                )}
                {pagenatedData.length > 1 && selectedOutput === 'graph' && (
                  <ul className="flex items-center justify-center mb-2">
                    {pageNo > 0 && (
                      <li
                        className="mx-2 cursor-pointer hover:text-primary1"
                        onClick={() => setPageNo(pageNo - 1)}
                      >
                        <span className="icon-back-arrow"></span> Previous
                      </li>
                    )}
                    {pageNo < pagenatedData.length - 1 && (
                      <li
                        className="mx-2 cursor-pointer hover:text-primary1"
                        onClick={() => setPageNo(pageNo + 1)}
                      >
                        Next <span className="icon-rght-arrow"></span>
                      </li>
                    )}
                  </ul>
                )}
                {loader ? (
                  <div className="relative">
                    <Treemap
                      {...treeProps}
                      style={{
                        display: treeData && !loader ? 'block' : 'none',
                      }}
                    />
                    <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full">
                      <div className="text-center">
                        <svg
                          className="w-10 h-10 mx-auto mb-3 text-primary1 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    </div>
                  </div>
                ) : selectedOutput === 'treemap' && error === null ? 
                !treeData ?                   <div className="relative">
                <Treemap
                  {...treeProps}
                  style={{
                    display: treeData && !loader ? 'block' : 'none',
                  }}
                />
                <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full">
                  Select a location on map
                </div>
              </div> : (
                  <div className="flex">
                    <div>
                      <div className="flex">
                        {treemapL1 && (
                          <button
                            onClick={() => {
                              setTreeData(treemapL1);
                              setTreemapL2(null);
                              setTreemapL3(null);
                            }}
                            className="bg-primary1 px-2 py-1 text-xs"
                          >
                            {treemapL1.title}
                          </button>
                        )}
                        {treemapL2 && (
                          <button
                            onClick={() => {
                              setTreeData(treemapL2);
                              setTreemapL3(null);
                            }}
                            className="bg-primary1 px-2 py-1 border-l-2 border-white text-xs"
                          >
                            {treemapL2.title}
                          </button>
                        )}
                        {treemapL3 && (
                          <button className="bg-primary1 px-2 py-1 border-l-2 border-white text-xs">
                            {treemapL3.title}
                          </button>
                        )}
                      </div>
                      <div className="flex">
                        <Treemap
                          {...treeProps}
                          style={{ display: treeData ? 'block' : 'none' }}
                        />
                        {treeData && (
                          <>
                            <div className="h-100 w-5 mr-2 ml-8 treemapLegend" />
                            <div className="flex flex-col justify-between">
                              <p>100%</p>
                              <p>0%</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  error &&
                  selectedOutput === 'treemap' && (
                    <div className="relative">
                      <Treemap
                        {...treeProps}
                        style={{
                          display: treeData && !error ? 'block' : 'none',
                        }}
                      />
                      <div className="absolute flex justify-center items-center top-0 left-0 w-full h-full">
                        {error}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {selectedOutput === 'graph' && (
              <div className="relative p-5 basis-4/12">
                <h2 className="text-base text-primary1">Metrics</h2>
                <div className="absolute inset-x-0 px-5 overflow-auto border-l top-10 bottom-5 border-white/10">
                  <Accordion accTitle={'Demography'} collapsed={false}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Male Population
                      </div>
                      <span className="text-primary1">{metric.male}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Female Population
                      </div>
                      <span className="text-primary1">{metric.female}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Female Population 14 to 49 Years
                      </div>
                      <span className="text-primary1">{metric.female_age}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Kids Population
                      </div>
                      <span className="text-primary1">{metric.kids}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Youth Population
                      </div>
                      <span className="text-primary1">{metric.youth}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Elderly Population
                      </div>
                      <span className="text-primary1">{metric.elderly}</span>
                    </div>
                  </Accordion>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div>Affluence</div>
                    <span className="text-primary1">{metric.affluence}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  },
);

export default ResultPanelSS;
