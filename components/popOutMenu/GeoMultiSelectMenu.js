import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

const GeoMultiSelectMenu = forwardRef(({
  offset,
  options,
  mouseLeave,
  selected,
  selectedOpts,
  show,
  deleted,
}, ref) => {
  const [values, setValues] = useState();
  const search = useRef()

  useImperativeHandle(ref, () => ({
    resetSearch() {
      setValues(options)
      selected([])
      search.current.value = null;
    },
  }))

  useEffect(() => {
    setValues(options);
  }, [options]);

  const selectedOpt = (e, opt) => {
    if (e.target.checked) {
      selected(opt);
    } else {
      deleted(opt);
    }
  };

  const filterOpt = (e) => {
    let filtered;
    if (e.target.value) {
      filtered = values.filter((item) =>
        e.target.value
          .toLowerCase()
          .split(' ')
          .every((v) => item.properties.name.toLowerCase().includes(v)),
      );
      setValues(filtered);
    } else {
      setValues(options);
    }
  };

  const selectAll = (e) => {
    let inputChecks = e.target.parentElement.parentElement.querySelectorAll(
      'input[type=checkbox]',
    );
    let features = [];
    if (e.target.checked) {
      for (let i = 0; i < inputChecks.length; i++) {
        inputChecks[i].checked = true;
        inputChecks[i].value !== 'selectAll' &&
          features.push(inputChecks[i].value);
      }
      selected(features);
    } else {
      for (let i = 0; i < inputChecks.length; i++) {
        inputChecks[i].checked = false;
        // inputChecks[i].value !== 'selectAll' &&
        // features.push(inputChecks[i].value);
      }
      selected([]);
    }
  };

  return (
    <div
      className={`ddOptions ${show ? 'activeDD' : ''}`}
      style={
        window.innerHeight - offset?.top > 250
          ? {
              top: offset?.top + 'px',
              left: offset?.left + 'px',
              maxHeight: `calc(100vh - ${offset?.top + 20}px)`,
            }
          : {
              bottom: window.innerHeight - 40 - offset?.top + 'px',
              left: offset?.left + 'px',
              maxHeight: `calc(100vh - ${window.innerHeight - offset?.top}px)`,
            }
      }
      onMouseLeave={mouseLeave}
    >
      <div className={`p-2`}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onKeyUp={filterOpt}
          ref={search}
        />
      </div>
      <ul>
        <li>
          <input
            type="checkbox"
            className="mr-2 checkBox"
            value="selectAll"
            onChange={selectAll}
          />
          <label className="cursor-pointer" htmlFor="selectAll">
            Select all
          </label>
        </li>
        {values?.map((subCat, index) => (
          <li key={index} className={`flex ${subCat.properties.isActive ? '' : 'pointer-events-none opacity-50 cursor-not-allowed'}`}>
            <input
              type="checkbox"
              className="mr-2 checkBox"
              id={subCat.properties.id}
              value={subCat.properties.name}
              checked = {selectedOpts.includes(subCat.properties.name)}
              onChange={(e) => selectedOpt(e, subCat.properties.name)}
            />
            <label className="cursor-pointer" htmlFor={subCat.properties.id}>
              {subCat.properties.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
})

export default GeoMultiSelectMenu;
