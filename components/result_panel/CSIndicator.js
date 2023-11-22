import { useEffect, useState } from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

function CSIndicator({ indc, locations, selectedMarket }) {
  const [customerSegmentation, setCustomerSegmentation] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [first, setFirst] = useState('');
  const [optionsForSecond, setOptionsForSecond] = useState([]);
  const [second, setSecond] = useState('');

  useEffect(() => {
    if (first == '') return;
    setOptionsForSecond(indc.find((x) => Object.keys(x)[0] === first)[first]);
    return () => {
      setFirst('');
      setCustomerSegmentation([]);
    };
  }, [first]);

  useEffect(() => {
    if (second == '') return;
    getCS();
    return () => {
      setSecond('');
      setCustomerSegmentation([]);
    };
  }, [second]);

  const getCS = async () => {
    let arrayOfIndicators = optionsForSecond.find(
      (x) => Object.keys(x)[0] === second,
    )[second];
    setIndicators(arrayOfIndicators);
    let arrayOfIds = locations.map((x) => x.properties.id);
    let res = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/customer-segmentation',
      {
        method: 'POST',
        body: JSON.stringify({
          arrayOfIds,
          arrayOfIndicators,
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      },
    );
    setCustomerSegmentation(await res.json());
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-10">
        <div>
          <label>First value</label>
          <select
            className="mt-2 form-control"
            onChange={(e) => setFirst(e.target.value)}
          >
            <option>Select a value</option>
            {indc.map((x, i) => (
              <option key={i}>{Object.keys(x)[0]}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Second value</label>
          <select
            className="mt-2 form-control"
            onChange={(e) => setSecond(e.target.value)}
          >
            <option>Select a value</option>
            {optionsForSecond.length &&
              optionsForSecond.map((x, i) => (
                <option key={i}>{Object.keys(x)[0]}</option>
              ))}
          </select>
        </div>
      </div>
      <div className="mt-6 border-y border-secondary/50">
        {customerSegmentation.length > 0 &&
          indicators.map((x, i) => (
            <div key={i} className="mb-11 first:mt-6">
              <h3 className="mb-4 text-base font-medium">{x.name}</h3>
              <div className="grid grid-cols-12 gap-10">
                {locations.length > 0 &&
                  locations.map((y, j) => (
                    <div className="col-span-3" key={j}>
                      <p className="mb-2 text-[10px] 2xl:text-xs text-right">
                        {selectedMarket === 'h8'
                          ? `${y.properties.hexid08}, (${y.properties.center})`
                          : `${y.properties.name}, ${y.properties.district}`}
                      </p>
                      <div
                        className="flex items-center p-1 rounded-md 2xl:p-2"
                        style={{ backgroundColor: '#7B44C7' }}
                      >
                        <span className="p-2 mr-2 text-sm rounded-full 2xl:text-xl icon-bar-graph bg-dark4"></span>{' '}
                        {customerSegmentation.find((x) =>
                          selectedMarket === 'h8'
                            ? x.hex08_key == y.properties.id
                            : x.village_cd == y.properties.id,
                        )[x.indicatr]
                          ? customerSegmentation
                              .find((x) =>
                                selectedMarket === 'h8'
                                  ? x.hex08_key == y.properties.id
                                  : x.village_cd == y.properties.id,
                              )
                              [x.indicatr].toFixed(2)
                          : '0'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default CSIndicator;
