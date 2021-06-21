import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import axios from 'axios';

const data = {
  id: 'root',
  name: 'Parent',
  children: [
    {
      id: '1',
      name: 'Child - 1',
    },
    {
      id: '3',
      name: 'Child - 3',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

class App extends React.Component {

  state = {
    data: null
  }

  componentDidMount(){
    console.log("calling apiCall in home");
     let header_data_get = {
        headers: {
            'Content-Type': 'application/json',         
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MGI1MTE4YmVkODA3ZDJlZDJlYjk0MTEiLCJpZCI6IjYwYjUxMThiZWQ4MDdkMmVkMmViOTQxMSIsImlhdCI6MTYyMzkyNTE1MiwiZXhwIjoxNjIzOTI2MDUyfQ.CypQI_ns31dN1zTnnPmrZxb9lYqLIkw0Hlwo-6A3UPI'             
        }
    }
    let that = this;
    axios.get("http://localhost:4000/users/60b71175217a3ba6eba613f1", header_data_get)
      .then(function (res) {
          console.log("Success --------------------------Multi :: ", res);
          


          that.setState({data : true});


      })
      .catch(function (err) {
          console.log("Error --------------------------Multi :: ", err)
          // dispatch(apiStatusAsync(false, true, err.message))
      })    
  }

  render(){

    const { classes } = this.props;
    const renderTree = (nodes) => (
      <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );

    if(this.state.data == null){
      return(<h4> Loading... </h4>);
    }

    return (
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(data)}
      </TreeView>
    );
  }
}

export default withStyles(useStyles)(App);