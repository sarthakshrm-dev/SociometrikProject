import { useEffect, useState } from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

function PoiIndicator({ indc, locations, selectedMarket }) {
  const [poi, setPoi] = useState([]);
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    getPois();
    setIndicators(
      [].concat.apply(
        [],
        indc.map((x, i) => x[Object.keys(x)]),
      ),
    );
  }, []);

  const getPois = async () => {
    let arrayOfIds = locations.map((x) => x.properties.id);
    let res = await fetch(
      publicRuntimeConfig.API_ROOT_URL +
        'indicators/' +
        selectedMarket +
        '/poi',
      {
        method: 'POST',
        body: JSON.stringify({
          arrayOfIds,
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      },
    );
    setPoi(await res.json());
  };

  return (
    <>
      {poi.length > 0 &&
        indicators.map((x, i) => (
          <div key={i} className="mb-11">
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
                      {poi.find((x) =>
                        selectedMarket === 'h8'
                          ? x.hex08_key == y.properties.id
                          : x.village_cd == y.properties.id,
                      )[x.indicatr]
                        ? poi
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
    </>
  );
}

export default PoiIndicator;
