function Legend({ indicator, legends }) {
  return (
    <div className="fixed rounded-lg bg-dark4 bottom-6 right-16 max-w-[150px]">
      <div className="p-2 pb-0 text-base text-white/60">
        {indicator?.name}
        <div className="text-xs opacity-70">{indicator?.unit}</div>
      </div>

      <div className="flex flex-col mt-2">
        {legends.map((legend, index) => (
          <div
            key={index}
            className="px-2 text-[10px] text-secondary flex items-center gap-2"
          >
            <div
              className="min-w-[30px] h-1 rounded-full"
              style={{ background: legend.color }}
            ></div>
            {legend.from != null || legend.from != undefined
              ? parseFloat(legend.from.toFixed(2)).toLocaleString()
              : ''}{' '}
            -{' '}
            {legend.to != null || legend.to != undefined
              ? parseFloat(legend.to.toFixed(2)).toLocaleString()
              : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Legend;
