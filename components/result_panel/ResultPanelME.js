// import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import * as turf from '@turf/turf';
import useMapStore from '../../stores/useMapStore';
import { XYPlot, YAxis, VerticalBarSeries, Hint, ChartLabel } from 'react-vis';
import 'react-vis/dist/style.css';
import Accordion from '../Accordion';
import ExportCSV from './ExportCSV';

function ResultPanelME({ graphData, selectedMarket, features, isOpen, close }) {
  const graphWidth = useRef();
  const map = useMapStore((state) => state.map);
  const [width, setWidth] = useState();
  const [value, setValue] = useState();
  const [metric, setMetric] = useState({});
  const [pagenatedData, setPagenatedData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [currentData, setCurrentData] = useState([]);
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

  const paginate = (arr, size) => {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size);
      let page = acc[idx] || (acc[idx] = []);
      page.push(val);

      return acc;
    }, []);
  };

  return (
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
          className="icon-cancel hover:text-red-500 text-white ml-2 cursor-pointer"
          onClick={close}
        ></span>
      </span>
      <div className="flex rounded-lg bg-gradient-to-b from-dark4 to-dark3">
        <div className="p-5 basis-8/12" ref={graphWidth}>
          <div className='flex justify-between'>
            <h2 className="text-base font-medium text-primary1">
              Top {selectedMarket === 'city' ? 'Urban' : 'Rural'} Markets
            </h2>
            <ExportCSV csvData={graphData} fileName="market-expansion" />
          </div>
          <div>
            <XYPlot width={width} height={240} xType="ordinal">
              <ChartLabel
                text={selectedMarket === 'city' ? 'Cities' : 'Districts'}
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
                  let feature = features.find(
                    (element) => element.properties.name === datapoint.x,
                  );

                  if (feature) {
                    if (selectedMarket === 'city') {
                      map.setFilter('bubble-highlighted', [
                        '==',
                        'name',
                        feature.properties.name,
                      ]);
                    } else {
                      map.setFilter('heat-highlighted', [
                        '==',
                        'name',
                        feature.properties.name,
                      ]);
                    }
                    setMetric({
                      male: feature.properties.male_population.toLocaleString(),
                      female:
                        feature.properties.female_population.toLocaleString(),
                      affluence: feature.properties.affluence,
                      population_growth: parseFloat(
                        feature.properties.population_growth.toFixed(2),
                      ).toLocaleString(),
                      built_up_growth: parseFloat(
                        feature.properties.built_up_growth.toFixed(2),
                      ).toLocaleString(),
                      economic_activity_score:
                        feature.properties.economic_activity_score,
                    });
                  }
                }}
                onValueMouseOut={(datapoint, event) => {
                  setValue();
                  map.setFilter('bubble-highlighted', ['==', 'name', '']);
                  map.setFilter('heat-highlighted', ['==', 'name', '']);
                }}
                onValueClick={(datapoint, event) => {
                  let fc = {
                    type: 'FeatureCollection',
                    features: features.filter(
                      (element) => element.properties.name === datapoint.x,
                    ),
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
                  <div className="bg-dark2 border border-primary2 px-2 py-1 rounded transition-all ease-in-out shadow">
                    <p>
                      {value.x}, {value.y}
                    </p>
                  </div>
                </Hint>
              ) : null}
            </XYPlot>
            {pagenatedData.length > 1 && (
              <ul className="flex justify-center items-center">
                {pagenatedData.map((x, i) => (
                  <li
                    className={`mx-2 cursor-pointer hover:text-primary1 ${
                      pageNo === i
                        ? 'text-primary1 border-b border-primary1'
                        : ''
                    }`}
                    key={i}
                    onClick={() => setPageNo(i)}
                  >
                    {i + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="relative p-5 basis-4/12">
          <h2 className="text-base text-primary1">Metrics</h2>
          <div className="absolute inset-x-0 px-5 overflow-auto border-l top-10 bottom-5 border-white/10">
            <Accordion accTitle={'Demography'} collapsed={false}>
              <div className="flex items-center justify-between mb-3">
                <div>Male</div>
                <span className="text-primary1">{metric.male}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>Female</div>
                <span className="text-primary1">{metric.female}</span>
              </div>
            </Accordion>
            <Accordion accTitle={'Growth'} collapsed={true}>
              <div className="flex items-center justify-between mb-3">
                <div>Population Growth</div>
                <span className="text-primary1">
                  {metric.population_growth}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>Built - up Growth</div>
                <span className="text-primary1">{metric.built_up_growth}</span>
              </div>
            </Accordion>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>Affluence</div>
              <span className="text-primary1">{metric.affluence}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>Economic Activity Score</div>
              <span className="text-primary1">
                {metric.economic_activity_score}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPanelME;
