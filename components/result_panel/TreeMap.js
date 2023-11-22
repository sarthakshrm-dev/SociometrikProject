import React from "react";
// import TreeMap from "react-d3-treemap";
// import "react-d3-treemap/dist/react.d3.treemap.css";
import * as d3 from "d3";

const Graph = ({data}) => {

    return (
        <TreeMap
        height={220}
        width={800}
        data={data}
        customD3ColorScale={d3
          .scaleSequential()
          .interpolator(d3.interpolateRgb("#E6E6E6", "#8800E4"))}
          darkNodeBorderColor=""
          lightNodeBorderColor=""
          breadCrumbClassName="breads"
        valueUnit="%"
        hideNumberOfChildren
        disableTooltip
      />
    
    )
}

export default Graph