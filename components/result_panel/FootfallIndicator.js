import React, { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  XYPlot,
  MarkSeriesCanvas,
  Borders,
  Highlight,
} from 'react-vis';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
function FootfallIndccator({ locations, selectedMarket }) {
  const [month, setMonth] = useState('');
  const [footfall, setFootfall] = useState([]);
  const [legend, seLegend] = useState([]);
  const xAxes = ['morning', 'afternoon', 'evening', 'night'];
  const yAxes = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  useEffect(() => {
    getFootfall();
    return () => {
      setMonth('');
    };
  }, [month]);

  const getFootfall = async () => {
    if (month != '') {
      const arrayOfIds = locations.map((x) => x.properties.id);
      const tn =
        selectedMarket === 'h8'
          ? 'hex08_footfal_' + month
          : 'village_footfal_' + month;
      const res = await fetch(
        publicRuntimeConfig.API_ROOT_URL +
          'indicators/' +
          selectedMarket +
          '/footfall',
        {
          method: 'POST',
          body: JSON.stringify({
            tn,
            arrayOfIds,
          }),
          headers: {
            'content-type': 'application/json',
          },
          redirect: 'follow',
        },
      );
      const data = await res.json();
      let temp = [],
        middleIndex,
        ranges = [];
      data.forEach((each) => {
        xAxes.forEach((x) => {
          yAxes.forEach((y) => temp.push(each['avg_' + y + '_' + x]));
        });
      });

      let array = [...new Set(temp)];
      array.sort((a, b) => b - a);

      if (Math.round(array.length / 4) < 1) {
        middleIndex = Math.ceil(array.length / 4);
      } else {
        middleIndex = Math.round(array.length / 4);
      }

      let first = array.splice(-middleIndex);
      let second = array.splice(-middleIndex);
      let third = array.splice(-middleIndex);
      let fourth = array;

      ranges.push({
        to: first[0],
        from: first[first.length - 1],
        color: 'bg-purple-300',
      });
      if (first.length > 0 && second.length > 0) {
        ranges.push({
          to: second[0],
          from: second[second.length - 1],
          color: 'bg-purple-500',
        });
      }
      if (second.length > 0 && third.length > 0) {
        ranges.push({
          to: third[0],
          from: third[third.length - 1],
          color: 'bg-purple-700',
        });
      }
      if (third.length > 0 && fourth.length > 0) {
        ranges.push({
          to: fourth[0],
          from: fourth[fourth.length - 1],
          color: 'bg-purple-900',
        });
      }
      seLegend(ranges);
      setFootfall(data);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-10">
        <div>
          <label>Year</label>
          <select className="mt-2 form-control">
            <option>Select a year</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <div>
          <label>Month {month}</label>
          <select
            className="mt-2 form-control"
            onChange={(e) => setMonth(e.target.value)}
          >
            <option>Select a Month</option>
            <option value="jan">January</option>
            <option value="feb">February</option>
            <option value="mar">March</option>
            <option value="apr">April</option>
            <option value="may">May</option>
            <option value="jun">June</option>
            <option value="july">July</option>
            <option value="aug">August</option>
            <option value="sep">September</option>
            <option value="oct">October</option>
            <option value="nov">November</option>
            <option value="dec">December</option>
          </select>
        </div>
      </div>

      <div className="flex mt-6 border-y border-secondary/50">
        {footfall.length > 0 &&
          locations.map((each, i) => (
            <div
              className="p-4 border-r border-secondary/50 basis-1/2 first:border-l"
              key={i}
            >
              <div className="text-xs">
                {selectedMarket === 'h8'
                  ? `${each.properties.hexid08}, (${each.properties.center})`
                  : `${each.properties.name}, ${each.properties.district}`}
              </div>

              <div className="flex my-5">
                <ul className="flex flex-col pt-6 pr-3 text-center justify-evenly">
                  <li>M</li>
                  <li>T</li>
                  <li>W</li>
                  <li>T</li>
                  <li>F</li>
                  <li>S</li>
                  <li>S</li>
                </ul>
                <div className="grow">
                  <ul className="grid grid-cols-4 mb-1 text-lg text-center">
                    <li title="Morning">
                      <span className="icon-morning"></span>
                    </li>
                    <li title="Afternoon">
                      <span className="icon-afternoon"></span>
                    </li>
                    <li title="Evening">
                      <span className="icon-evening"></span>
                    </li>
                    <li title="Night">
                      <span className="icon-night"></span>
                    </li>
                  </ul>
                  <div className="border rounded-md border-primary1">
                    {yAxes.map((y, j) => (
                      <div className="flex justify-around my-3" key={j}>
                        {xAxes.map((x, k) => (
                          <span
                            className={`w-4 h-4 rounded-full ${
                              legend.find(
                                (a) =>
                                  footfall.find((f) =>
                                    selectedMarket === 'h8'
                                      ? f.hexid08 == each.properties.id
                                      : f.village_cd == each.properties.id,
                                  )['avg_' + y + '_' + x] <= a.to,
                              ).color
                            }`}
                            key={k}
                          ></span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                {legend.length > 0 &&
                  legend.map((x, i) => (
                    <div className="ml-3" key={i}>
                      <div className={`h-1 ${x.color} rounded`}></div>
                      {x.to}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default FootfallIndccator;
