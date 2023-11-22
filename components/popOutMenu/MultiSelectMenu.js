import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

const MultiSelectMenu = forwardRef(({
  offset,
  options,
  selectedOpts,
  mouseLeave,
  selected,
  show,
  deleted,
  subLevel,
}, ref) => {
  const [subChildOpt, setSubChildOpt] = useState();
  const [subChildOpt2, setSubChildOpt2] = useState();
  const [values, setValues] = useState();
  const [subValues, setSubValues] = useState();
  const [subValues2, setSubValues2] = useState();

  const search = useRef()

  const checkSelected = (opt) => {
    return selectedOpts.filter(item => item.name === opt).length > 0 ? true : false;
  }
  useImperativeHandle(ref, () => ({
    resetSearch() {
      setValues(options)
      selected([])
      setSubChildOpt(null)
      setSubChildOpt2(null)
      setSubValues(null)
      setSubValues2(null)
      search.current.value = null;
    },
  }))

  useEffect(() => {
    setValues(options);
  }, [options]);

  const selectedOpt = (e, opt) => {

    if (e.target.checked) {
      let obj = new Object();
      obj = opt;
      obj['target'] = e.target.id;
      selected(obj);
    } else {
      deleted(opt.name);
    }
  };

  const filterOpt = (e) => {
    let filtered;
    if (e.target.value) {
      if (subLevel === 2) {
        if (subChildOpt) {
          let find = values.find(
            (element, i) => Object.keys(values[i])[0] == subChildOpt,
          );
          if (find) {
            let filteredSub = find[subChildOpt].filter((item) =>
              e.target.value
                .toLowerCase()
                .split(' ')
                .every((v) => item.name.toLowerCase().includes(v)),
            );
            setSubValues(filteredSub);
          }
        } else {
          filtered = values.filter((item) =>
            e.target.value
              .toLowerCase()
              .split(' ')
              .every((v) => Object.keys(item)[0].toLowerCase().includes(v)),
          );
          setValues(filtered);
        }
      } else if (subLevel === 3) {
        if (subChildOpt2) {
          let a = values.find(
            (element, i) => Object.keys(values[i])[0] == subChildOpt,
          );
          if (a) {
            let b = a[subChildOpt].find(
              (element, i) => Object.keys(a[subChildOpt][i])[0] == subChildOpt2,
            );
            if (b) {
              let c = b[Object.keys(b)].filter((item) =>
                e.target.value
                  .toLowerCase()
                  .split(' ')
                  .every((v) => item.name.toLowerCase().includes(v)),
              );
              setSubValues2(c);
            }
          }
        } else if (subChildOpt) {
          let find2 = values.find(
            (element, i) => Object.keys(values[i])[0] == subChildOpt,
          );
          if (find2) {
            let filteredSub2 = find2[subChildOpt].filter((item) =>
              e.target.value
                .toLowerCase()
                .split(' ')
                .every((v) => Object.keys(item)[0].toLowerCase().includes(v)),
            );
            setSubValues(filteredSub2);
          }
        } else {
          filtered = values.filter((item) =>
            e.target.value
              .toLowerCase()
              .split(' ')
              .every((v) => Object.keys(item)[0].toLowerCase().includes(v)),
          );
          setValues(filtered);
        }
      } else {
        filtered = values.filter((item) =>
          e.target.value
            .toLowerCase()
            .split(' ')
            .every((v) => item.name.toLowerCase().includes(v)),
        );
        setValues(filtered);
      }
    } else {
      setValues(options);
      setSubValues();
      setSubValues2();
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
      <div className={`p-2 ${subChildOpt ? '' : ''}`}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onKeyUp={filterOpt}
          ref={search}
        />
      </div>
      <ul>
        {values?.map((subCat, index) =>
          subLevel === 2 ? (
            <>
              <li key={index} className={subChildOpt ? 'hidden' : ''}>
                <div onClick={() => setSubChildOpt(Object.keys(subCat)[0])}>
                  {Object.keys(subCat)[0]}{' '}
                </div>
              </li>
              <div
                className={`transition-all overflow-hidden ${
                  subChildOpt === Object.keys(subCat)[0]
                    ? 'visible z-10 opacity-100 h-auto'
                    : 'invisible -z-10 opacity-0 h-0'
                }`}
              >
                <div
                  className="relative px-5 py-2 text-center transition-all border-b cursor-pointer border-white/50"
                  onClick={() => setSubChildOpt('')}
                >
                  <span className="absolute icon-back-arrow left-2 top-3"></span>
                  {subChildOpt}
                </div>
                <ul>
                  {(subValues ? subValues : subCat[Object.keys(subCat)[0]]).map(
                    (subSubCat, index) => (
                      <li className="flex indicators" key={index}>
                        <input
                          type="checkbox"
                          className="absolute checkBox"
                          id={
                            Object.keys(subCat)[0].replaceAll(' ', '-') +
                            '_' +
                            subSubCat.indicatr
                          }
                          value={subSubCat.name}
                          checked={checkSelected(subSubCat.name)}
                          onChange={(e) => selectedOpt(e, subSubCat)}
                        />
                        <label
                          className="block pl-6 cursor-pointer"
                          htmlFor={
                            Object.keys(subCat)[0].replaceAll(' ', '-') +
                            '_' +
                            subSubCat.indicatr
                          }
                        >
                          {subSubCat.name}
                        </label>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </>
          ) : subLevel === 3 ? (
            <>
              <li key={index} className={subChildOpt ? 'hidden' : ''}>
                <div onClick={() => setSubChildOpt(Object.keys(subCat)[0])}>
                  {Object.keys(subCat)[0]}{' '}
                </div>
              </li>
              <div
                className={`transition-all overflow-hidden ${
                  subChildOpt === Object.keys(subCat)[0]
                    ? 'visible z-10 opacity-100 h-auto'
                    : 'invisible -z-10 opacity-0 h-0'
                }`}
              >
                <div
                  className={`relative px-5 py-2 text-center transition-all border-b cursor-pointer border-white/50 ${
                    subChildOpt2 ? 'hidden' : ''
                  }`}
                  onClick={() => setSubChildOpt('')}
                >
                  <span className="absolute icon-back-arrow left-2 top-3"></span>
                  {subChildOpt}
                </div>
                <ul>
                  {(subValues ? subValues : subCat[Object.keys(subCat)[0]]).map(
                    (subSubCat, index) => (
                      <>
                        <li
                          className={`cursor-pointer indicators ${
                            subChildOpt2 ? 'hidden' : ''
                          }`}
                          key={index}
                        >
                          <div
                            onClick={() =>
                              setSubChildOpt2(Object.keys(subSubCat)[0])
                            }
                          >
                            {Object.keys(subSubCat)[0]}
                          </div>
                        </li>
                        <div
                          className={`transition-all overflow-hidden ${
                            subChildOpt2 === Object.keys(subSubCat)[0]
                              ? 'visible z-10 opacity-100 h-auto'
                              : 'invisible -z-10 opacity-0 h-0'
                          }`}
                        >
                          <div
                            className="relative px-5 py-2 text-center transition-all border-b cursor-pointer border-white/50"
                            onClick={() => setSubChildOpt2()}
                          >
                            <span className="absolute icon-back-arrow left-2 top-3"></span>
                            {subChildOpt2}
                          </div>
                          <ul>
                            {(subValues2
                              ? subValues2
                              : subSubCat[Object.keys(subSubCat)[0]]
                            ).map((subSubCat2, index) => (
                              <li className="indicators" key={index}>
                                <input
                                  type="checkbox"
                                  className="absolute checkBox"
                                  id={
                                    Object.keys(subCat)[0].replaceAll(
                                      ' ',
                                      '-',
                                    ) +
                                    '_' +
                                    subSubCat2.indicatr
                                  }
                                  value={subSubCat2.name}
                                  checked={checkSelected(subSubCat2.name)}
                                  onChange={(e) => selectedOpt(e, subSubCat2)}
                                />
                                <label
                                  className="block pl-6 cursor-pointer"
                                  htmlFor={
                                    Object.keys(subCat)[0].replaceAll(
                                      ' ',
                                      '-',
                                    ) +
                                    '_' +
                                    subSubCat2.indicatr
                                  }
                                >
                                  {subSubCat2.name}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ),
                  )}
                </ul>
              </div>
            </>
          ) : (
            <li className="flex indicators" key={index}>
              <input
                type="checkbox"
                className="absolute checkBox"
                id={subCat.indicatr}
                value={subCat.name}
                checked={checkSelected(subCat.name)}
                onChange={(e) => selectedOpt(e, subCat)}
              />
              <label className="block pl-6 cursor-pointer" htmlFor={subCat.indicatr}>
                {subCat.name}
              </label>
            </li>
          ),
        )}
      </ul>
    </div>
  );
})

export default MultiSelectMenu;
