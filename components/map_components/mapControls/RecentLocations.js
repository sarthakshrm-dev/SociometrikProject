import useMapStore from '../../../stores/useMapStore';

function RecentLocations({ bookmarks }) {
  const map = useMapStore((state) => state.map);

  const zoomToBookmark = (bookmark) => {
    map.flyTo({
      center: [bookmark.location.x, bookmark.location.y],
      zoom: bookmark.zoom,
    });
  };

  return (
    <div className="fixed bottom-5 z-10 right-1/4 bg-gradient-to-b from-dark1 to-dark4 p-8 w-2/4 shadow-lg rounded-lg">
      <span className="font-medium text-primary1 border-b text-base border-primary1">
        Recent Locations
      </span>
      <div className="max-h-52 overflow-auto mt-4">
        {bookmarks &&
          bookmarks.map((each, i) => (
            <div
              className="grid grid-cols-4 gap-4 py-2 border-b border-primary1"
              key={i}
              onClick={() => zoomToBookmark(each)}
            >
              <span className="relative">
                <img
                  src={each.image}
                  alt=""
                  width="152"
                  height="57"
                  className="rounded-md object-cover"
                />
              </span>
              <span className="text-sm">
                <h5>Location</h5>
                <span className="text-primary1 font-medium">
                  {each.address.state_district
                    ? each.address.state_district
                    : each.address.city}
                  , {each.address.state}
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RecentLocations;
