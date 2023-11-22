import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';

const MultiLevelMenu = forwardRef(
  (
    { offset, options, mouseLeave, selected, show, deleted, subLevel, hide, categories },
    ref,
  ) => {
    const [subChildOpt, setSubChildOpt] = useState();
    const [subChildOpt2, setSubChildOpt2] = useState();
    const [values, setValues] = useState();
    const [subValues, setSubValues] = useState();
    const [subValues2, setSubValues2] = useState();

    const search = useRef();

    useImperativeHandle(ref, () => ({
      resetSearch() {
        setValues(options)
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
                (element, i) =>
                  Object.keys(a[subChildOpt][i])[0] == subChildOpt2,
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
                maxHeight: `calc(100vh - ${
                  window.innerHeight - offset?.top
                }px)`,
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
                    {(subValues
                      ? subValues
                      : subCat[Object.keys(subCat)[0]]
                    ).map((subSubCat, index) => (
                      <li className="flex indicators" key={index}>
                        <label
                          className="block pl-6 cursor-pointer"
                          htmlFor={
                            Object.keys(subCat)[0].replaceAll(' ', '-') +
                            '_' +
                            subSubCat.indicatr
                          }
                          onClick={() => {
                            selected(subSubCat.name);
                            hide();
                            setTimeout(() => {
                              setSubChildOpt('');
                              setSubChildOpt2('')
                            }, 500);
                          }}
                        >
                          {subSubCat.name}
                        </label>
                      </li>
                    ))}
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
                    {(subValues
                      ? subValues
                      : subCat[Object.keys(subCat)[0]]
                    ).map((subSubCat, index) => (
                      <>
                        <li
                          className={`cursor-pointer indicators ${
                            subChildOpt2 ? 'hidden' : ''
                          }`}
                          key={index}
                        >
                          <div
                            onClick={() => {
                              setSubChildOpt2(Object.keys(subSubCat)[0]);
                              categories(subChildOpt, Object.keys(subSubCat)[0]);
                            }}
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
                                <label
                                  className="block cursor-pointer"
                                  htmlFor={
                                    Object.keys(subCat)[0].replaceAll(
                                      ' ',
                                      '-',
                                    ) +
                                    '_' +
                                    subSubCat2.indicatr
                                  }
                                  onClick={() => {
                                    selected(subSubCat2.name);
                                    hide();
                                    setTimeout(() => {
                                      setSubChildOpt('');
                                      setSubChildOpt2('')
                                    }, 500);
                                  }}
                                >
                                  {subSubCat2.name}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <li className="flex indicators" key={index}>
                <label
                  className="block pl-6 cursor-pointer"
                  htmlFor={subCat.indicatr}
                  onClick={() => {
                    selected(subCat.name);
                    hide();
                    setTimeout(() => {
                      setSubChildOpt('');
                      setSubChildOpt2('')
                    }, 500);
                  }}
                >
                  {subCat.name}
                </label>
              </li>
            ),
          )}
        </ul>
      </div>
    );
  },
);

export default MultiLevelMenu;
