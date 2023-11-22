import IndicatorItem from './IndicatorItem';

function Indicator({ indc, locations, selectedMarket, hoverLocation }) {
  return (
    <>
      {indc.map((x, i) => (
        <div key={i} className="mb-11">
          <h3 className="mb-4 font-medium 2xl:text-base">{x.name}</h3>
          <div className="grid grid-cols-12 gap-10">
            {locations.length > 0 &&
              locations.map((y, j) => (
                <div className="col-span-3" key={j} onMouseOver={() => hoverLocation(y)}>
                  <IndicatorItem
                    location={y}
                    indicator={x.indicatr}
                    selectedMarket={selectedMarket}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default Indicator;
