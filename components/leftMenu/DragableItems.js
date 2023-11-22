import { useEffect, useState } from 'react';

function DragableItems({
  listItem,
  handleDragStart,
  handleDragEnter,
  dragEnd,
  index,
  active,
  deleteDp,
  enableOnMap,
}) {
  // const [list, setList] = useState();
  useEffect(() => console.log(listItem), [listItem]);
  return (
    <>
      <li
        className='flex flex-wrap items-center justify-between mb-4'
        draggable
        onDragOver={(ev) => ev.preventDefault()}
        onDragStart={() => handleDragStart(index)}
        onDragEnter={() => handleDragEnter(index)}
        onDragEnd={dragEnd}
      >
        <div className='text-[8px] basis-full'>Ranked {index + 1}</div>
        <div
          className={`flex justify-between items-center px-2 py-1 border rounded-md basis-11/12 border-primary1 cursor-grab transition-all ${
            active ? 'bg-primary2' : ''
          }`}
        >
          <div>
            {listItem.name} <br />
            <button
              className='text-[10px] text-primary1'
              onClick={() => enableOnMap(listItem)}
            >
              Enable Map View
            </button>
          </div>
          <div className='text-primary1'>
            <span className='icon-up-arrow'></span>
            <span className='icon-down-arrow'></span>
          </div>
        </div>

        <span
          className='text-right text-red-300 cursor-pointer icon-cancel basis-1/12 hover:opacity-50'
          onClick={() => deleteDp(listItem.name)}
        ></span>
      </li>
    </>
  );
}

export default DragableItems;
