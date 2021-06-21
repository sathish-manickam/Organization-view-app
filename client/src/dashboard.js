import { React, useState } from "react";
import Tree from "react-d3-tree";
import Grid from '@material-ui/core/Grid';
import orgChartJson from "./data/org-chart.json";
import { useCenteredTree } from "./helpers";
import axios from "axios";
import "./styles.css";

const containerStyles = {
  width: "1850px",
  height: "100vh",
  overflow: "auto"
};

// Here we're using `renderCustomNodeElement` render a component that uses
// both SVG and HTML tags side-by-side.
// This is made possible by `foreignObject`, which wraps the HTML tags to
// allow for them to be injected into the SVG namespace.
const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps
}) => (
  <g>
    <circle r={15}></circle>
    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
      <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
        <h5 style={{ textAlign: "center", marginBottom: "5px" }}>{nodeDatum.name}</h5>
         <p style={{ textAlign: "center", marginTop: "0px", fontSize :"10px" }}> {nodeDatum.occupication} </p>
        {nodeDatum.children && (
          <button style={{ width: "100%" }} onClick={toggleNode}>
            {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>
    </foreignObject>
  </g>
);





async function getData(){
   console.log("calling apiCall in home");
   const dataObj = {}
   let header_data_get = {
      headers: {
          'Content-Type': 'application/json',         
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MGI1MTE4YmVkODA3ZDJlZDJlYjk0MTEiLCJpZCI6IjYwYjUxMThiZWQ4MDdkMmVkMmViOTQxMSIsImlhdCI6MTYyMzkyNTE1MiwiZXhwIjoxNjIzOTI2MDUyfQ.CypQI_ns31dN1zTnnPmrZxb9lYqLIkw0Hlwo-6A3UPI'             
      }
  }
  let that = this;
  await axios.get("http://localhost:4000/users/60b71175217a3ba6eba613f1", header_data_get)
    .then(function (res) {
        console.log("Success --------------------------Multi :: ", res);
        dataObj = true;
    })
    .catch(function (err) {
        console.log("Error --------------------------Multi :: ", err)
        // dispatch(apiStatusAsync(false, true, err.message))
    }) 

    return dataObj;
}
    


export default function Dashboard() {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div style={containerStyles} ref={containerRef}>    
          <Tree
            data={orgChartJson}
            translate={translate}
            nodeSize={nodeSize}
            renderCustomNodeElement={(rd3tProps) =>
              renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
            }
            orientation="vertical"
          />
        </div>
      </Grid>
    </Grid>
  );
}
