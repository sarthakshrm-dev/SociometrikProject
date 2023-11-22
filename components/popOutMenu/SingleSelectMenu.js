function SingleSelectMenu({show, offset, options, selected, mouseLeave, activeOpt}) {
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
      <ul>
        {options?.map((industryOpt, index) => (
          <li
            onClick={() => selected(industryOpt.name)}
            className={activeOpt === industryOpt.name ? 'ddSelected' : ''}
            key={index}
          >
            {industryOpt.name} <span className="icon-tick"></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SingleSelectMenu;
