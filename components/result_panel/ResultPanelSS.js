// import mapboxgl from 'mapbox-gl';
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import * as turf from '@turf/turf';
import useMapStore from '../../stores/useMapStore';
import { XYPlot, YAxis, VerticalBarSeries, Hint, ChartLabel } from 'react-vis';
import 'react-vis/dist/style.css';
import CompareSite from './CompareSite';
import getConfig from 'next/config';
import { data } from 'autoprefixer';
import ExportCSV from './ExportCSV';
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

    useImperativeHandle(ref, () => ({
      resetSelectedLoc() {
        setLocations([]);
      },
    }));

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

    const paginate = (arr, size) => {
      return arr.reduce((acc, val, i) => {
        let idx = Math.floor(i / size);
        let page = acc[idx] || (acc[idx] = []);
        page.push(val);

        return acc;
      }, []);
    };

    const toggleCompetitors = (e) => {
      if (e.target.checked) {
        map.setLayoutProperty('pointPOIs', 'visibility', 'visible');
        map.setLayoutProperty('clusters', 'visibility', 'visible');
        map.setLayoutProperty('cluster-count', 'visibility', 'visible');
      } else {
        map.setLayoutProperty('pointPOIs', 'visibility', 'none');
        map.setLayoutProperty('clusters', 'visibility', 'none');
        map.setLayoutProperty('cluster-count', 'visibility', 'none');
      }
    };

    const addLocation = (e) => {
      const coordinates = e.lngLat;
      storeLocation(coordinates);
      const feature = map
        .queryRenderedFeatures(e.point)
        .find((x) => ['villages', 'grids'].includes(x.layer.id));
      let state = states.find(
        (element) => element.properties.id == feature.properties.stat_cd,
      );
      let f = turf.feature(feature.geometry);
      let centroid = turf.centroid(f.geometry);
      f.properties = feature.properties;
      f.properties['state'] = state.properties.name;
      f.properties['center'] =
        centroid.geometry.coordinates[0].toFixed(3) +
        ', ' +
        centroid.geometry.coordinates[1].toFixed(3);
      if (selectedMarket === 'h8') {
        let locality = localities.find(
          (x) => x.properties.id === parseInt(feature.properties.locality_id),
        );
        f.properties['locality'] = locality
          ? locality.properties.name
          : 'Not provided';
        map.setFilter('hex-highlighted', [
          '==',
          'hexid08',
          feature.properties.hexid08,
        ]);
      } else {
        let district = districts.find(
          (element) => element.properties.id == feature.properties.dist_cd,
        );
        f.properties['district'] = district.properties.name;
        map.setFilter('heat-highlighted', [
          '==',
          'village_cd',
          feature.properties.village_cd,
        ]);
      }
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

    const storeLocation = async (coordinates) => {
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
      await fetch(publicRuntimeConfig.API_ROOT_URL + 'bookmarks/', {
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
    };
    return (
      <>
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
              onClick={() => {
                close();
                setLocations([]);
              }}
            ></span>
          </span>
          <div className="flex rounded-lg bg-gradient-to-b from-dark4 to-dark3">
            <div className="p-5 basis-8/12" ref={graphWidth}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-primary1">
                  Locations
                </h2>
                <div className="flex items-center">
                  <ExportCSV csvData={graphData} fileName="market-expansion" />
                  <div className="flex items-center ml-4">
                    Competitors Layer{' '}
                    <input
                      type="checkbox"
                      className="ml-2 checkSwitch"
                      onChange={toggleCompetitors}
                    />
                  </div>
                </div>
              </div>

              <div className="h-60">
                <XYPlot width={width} height={240} xType="ordinal">
                  <ChartLabel
                    text={selectedMarket === 'h8' ? 'Localities' : 'Villages'}
                    className="alt-x-label"
                    includeMargin={false}
                    xPercent={0.5}
                    yPercent={1.2}
                  />
                  <ChartLabel
                    text="Market potential score"
                    className="alt-y-label"
                    xPercent={0.01}
                    yPercent={0.2}
                    style={{
                      transform: 'rotate(-90)',
                      textAnchor: 'end',
                    }}
                  />
                  <YAxis hideLine />
                  <VerticalBarSeries
                    color="#7B44C7"
                    onValueMouseOver={(datapoint, event) => {
                      setValue(datapoint);
                      if (selectedMarket === 'h8') {
                        let feature = features.find(
                          (x) =>
                            x.properties.hexid08 === datapoint.x.split(',')[0],
                        );
                        map.setFilter('hex-highlighted', [
                          '==',
                          'hexid08',
                          feature.properties.hexid08,
                        ]);
                      } else {
                        let village = features.find(
                          (element) =>
                            element.properties.name ===
                            datapoint.x.split(',')[0],
                        );
                        map.setFilter('heat-highlighted', [
                          '==',
                          'village_cd',
                          village.properties.village_cd,
                        ]);
                      }
                    }}
                    onValueMouseOut={(datapoint, event) => {
                      setValue();
                      map.setFilter('hex-highlighted', ['==', 'name', '']);
                      map.setFilter('heat-highlighted', [
                        '==',
                        'village_cd',
                        '',
                      ]);
                    }}
                    onValueClick={(datapoint, event) => {
                      let fc = {
                        type: 'FeatureCollection',
                        features: features.filter((element) => {
                          return selectedMarket === 'h8'
                            ? element.properties.hexid08 ===
                                datapoint.x.split(',')[0]
                            : element.properties.name ===
                                datapoint.x.split(',')[0];
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
                          {value.x}, {value.y}
                        </p>
                      </div>
                    </Hint>
                  ) : null}
                </XYPlot>
                {pagenatedData.length > 1 && (
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
              </div>
            </div>
            <div className="p-5 basis-4/12">
              <h2 className="mb-4 text-base font-medium">
                Recent visited locations
              </h2>
              <div className="relative h-56 px-3 overflow-auto border-l border-white/10">
                {locations.length > 0 ? (
                  <>
                    {locations.map((x, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="px-2 py-1 border grow border-primary1 text-[10px] rounded">
                          {selectedMarket === 'h8'
                            ? `${x.properties.hexid08}, (${x.properties.center})`
                            : `${x.properties.name}, ${x.properties.district}`}
                        </div>
                        <span
                          className="ml-2 cursor-pointer icon-cancel text-highlight"
                          onClick={() => {
                            const newLocations = locations.filter(
                              (l, index) => index !== i,
                            );
                            setLocations(newLocations);
                          }}
                        ></span>
                      </div>
                    ))}
                    <div className="absolute bottom-0 inset-x-3">
                      {locations.length == 4 && (
                        <button
                          className="w-full btn-primary"
                          onClick={() => setDoCompare(true)}
                        >
                          Compare Sites
                        </button>
                      )}
                      {locations.length < 4 && (
                        <div
                          className="text-center cursor-pointer"
                          onClick={() => setMapClick(true)}
                        >
                          <span className="icon-marker"></span> Add more
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 px-5 overflow-auto border-l border-white/10">
                    <p className="pb-3 text-secondary">
                      Tap below to add a location on the map.
                    </p>
                    <div className="relative h-40 border border-dashed rounded-lg border-primary2">
                      <button
                        className="absolute p-2 text-center rounded-md bg-primary2 inset-8"
                        onClick={() => setMapClick(true)}
                      >
                        <span className="icon-marker">
                          <br />
                        </span>
                        Add a location
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {doCompare && (
          <CompareSite
            locations={locations}
            features={features}
            selectedMarket={selectedMarket}
            isOpen={doCompare}
            closeCompare={() => setDoCompare(false)}
            // localities={localities}
          />
        )}
      </>
    );
  },
);

export default ResultPanelSS;
