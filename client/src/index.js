import React from 'react';
import ReactDOM from 'react-dom';
import { positions, Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import './index.css';
import App from './App';

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 1500,
};

ReactDOM.render(
  <Provider template={AlertTemplate} {...options}>
    <App />
  </Provider>,
  document.getElementById('root')
);
