export default function TradeArea({ areaTitle }) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-medium">{areaTitle}</h2>
      <div className="grid grid-cols-3 gap-4 p-4 mt-3 border rounded-md 2xl:grid-cols-6 border-primary1">
        <div>
          <h5 className="font-medium text-primary1">Total Footfall</h5>
          <p>3543</p>
        </div>

        <div>
          <h5 className="font-medium text-primary1">Total competitors</h5>
          <p>3543</p>
        </div>

        <div>
          <h5 className="font-medium text-primary1">Competitors Footfall</h5>
          <p>3543</p>
        </div>

        <div>
          <h5 className="font-medium text-primary1">Average Footfall</h5>
          <p>3543</p>
        </div>

        <div>
          <h5 className="font-medium text-primary1">Busiest Day</h5>
          <p>3543</p>
        </div>

        <div>
          <h5 className="font-medium text-primary1">Busiest Time Window</h5>
          <p>3543</p>
        </div>
      </div>
    </div>
  );
}
