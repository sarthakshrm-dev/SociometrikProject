import { useEffect, useState } from 'react';
import Loader from '../Loader';
import DragableItems from './DragableItems';
import * as turf from '@turf/turf';
import { ToastContainer, toast } from 'react-toastify';

function RankData({
  data,
  back,
  deleteDp,
  enableOnMap,
  selectedMarket,
  identifier,
  graphData,
  features,
  districts,
  resultSwitch,
}) {
  const [loader, setLoader] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [dragedIndex, setDragedIndex] = useState();
  const [dropedIndex, setDropedIndex] = useState();
  const [itemCount, setItemCount] = useState(0);
  const [isActive, setIsactive] = useState(true);

  useEffect(() => {
    setListItems(data);
  }, [data]);

  useEffect(() => {
    listItems.length < 1 && back();
    features?.length !== itemCount ? setIsactive(true) : setIsactive(false);
  }, [listItems.length]);

  useEffect(() => {
    !resultSwitch ? setIsactive(true) : setIsactive(false);
  }, [resultSwitch]);

  const swapElement = async () => {
    let array = listItems;
    var element = array.splice(dragedIndex, 1)[0];
    array.splice(dropedIndex, 0, element);
    setListItems(array);
    setDragedIndex(null);
    setDropedIndex(null);
    setIsactive(true);
  };

  const arrayList = (item, index) => {
    return (
      <DragableItems
        key={index}
        index={index}
        listItem={item}
        handleDragStart={(dragedindex) => setDragedIndex(dragedindex)}
        handleDragEnter={(dropedIndex) => setDropedIndex(dropedIndex)}
        dragEnd={swapElement}
        active={dropedIndex === index}
        deleteDp={deleteDp}
        enableOnMap={enableOnMap}
      />
    );
  };

  const getResult = async () => {
    setItemCount(listItems.length);
    let indicator_priority_mapping = new Object();
    listItems.forEach(
      (x, i) => (indicator_priority_mapping[x.indicatr] = i + 1),
    );
    setLoader(true);
    let res = await fetch(
      'http://ec2-43-205-134-174.ap-south-1.compute.amazonaws.com:443/get_ranking',
      {
        method: 'POST',
        body: JSON.stringify({
          geo_level: capitalizeFirstLetter(selectedMarket),
          indicator_priority_mapping: indicator_priority_mapping,
          identifier: identifier,
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      },
    );
    setLoader(false);
    if (res.ok) {
      let data = await res.json();
      setIsactive(false);
      let result = [];
      if (selectedMarket === 'city') {
        Object.keys(data).forEach((element) => {
          let name = features.find((x) => x.properties.town_cd === element)
            ?.properties.name;
          result.push({ x: name, y: parseFloat(data[element].toFixed(2)) });
        });
      } else if (selectedMarket === 'district') {
        Object.keys(data).forEach((element) => {
          let name = features.find((x) => x.properties.dist_cd === element)
            ?.properties.name;
          result.push({ x: name, y: parseFloat(data[element].toFixed(2)) });
        });
      } else if (selectedMarket === 'h8') {
        Object.keys(data).forEach((element) => {
          let hex = features.find((x) => x.properties.hexid08 === element);
          var centroid = turf.centroid(hex.geometry);
          result.push({
            x:
              hex.properties.hexid08 +
              ', (' +
              centroid.geometry.coordinates[0].toFixed(3) +
              ', ' +
              centroid.geometry.coordinates[1].toFixed(3) +
              ')',
            y: parseFloat(data[element].toFixed(2)),
          });
        });
      } else if (selectedMarket === 'village') {
        Object.keys(data).forEach((element) => {
          let village = features.find(
            (x) => x.properties.village_cd === element,
          );
          let district = districts.find(
            (x) => x.properties.id === village.properties.dist_cd,
          );
          result.push({
            x: village.properties.name + ', ' + district.properties.name,
            y: parseFloat(data[element].toFixed(2)),
          });
        });
      }
      result.sort((a, b) => b.y - a.y);
      graphData(result);
    } else {
      toast.error(
        'We are experiencing some difficulties to calculate score. Please try again later.',
      );
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      {loader && <Loader />}
      <ToastContainer position="top-center" theme="colored" />
      <h3 className="relative mb-4 text-base font-medium text-center">
        <button onClick={back}>
          <span className="absolute icon-back-arrow left-2 top-1"></span>
        </button>{' '}
        Rank Data Layers
      </h3>

      <ul>{listItems.map(arrayList)}</ul>
      {isActive && (
        <button className="w-full my-4 btn-primary" onClick={getResult}>
          Submit
        </button>
      )}
    </>
  );
}

export default RankData;
