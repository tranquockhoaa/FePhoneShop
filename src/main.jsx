import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
// import 'antd/dist/reset.css';
// import 'antd/dist/antd.css';
import './index.css';

import store from './store/index';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
