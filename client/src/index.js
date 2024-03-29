import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Dashboard from './dashboard';
import PrimarySearchAppBar from './appbar';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
  	<BrowserRouter>
        <Switch>
        	<Route path="/dashboard">
	          	<PrimarySearchAppBar />
	            <Dashboard />
	        </Route>  
        	<Route path="/">
	            <App />
	        </Route>          	        
        </Switch>
    </BrowserRouter>  	
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
