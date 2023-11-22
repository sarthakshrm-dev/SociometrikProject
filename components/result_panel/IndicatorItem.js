function IndicatorItem({ location, indicator, selectedMarket }) {
  return (
    <>
      <p className="mb-2 text-[10px] 2xl:text-xs text-right">
        {selectedMarket === 'h8'
          ? `${location.properties.hexid08}, (${location.properties.center})`
          : `${location.properties.name}, ${location.properties.district}`}
      </p>
      <div
        className="flex items-center p-1 rounded-md 2xl:p-2"
        style={{ backgroundColor: '#7B44C7' }}
      >
        <span className="p-2 mr-2 text-sm rounded-full 2xl:text-xl icon-bar-graph bg-dark4"></span>{' '}
        {location.properties[indicator]
          ? location.properties[indicator].toFixed(2)
          : '0'}
      </div>
    </>
  );
}

export default IndicatorItem;
