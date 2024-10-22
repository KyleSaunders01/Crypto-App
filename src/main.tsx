import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HashRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux';

import App from './App.tsx'
import store from './app/store';
import 'antd/dist/reset.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>
  </StrictMode>,
)
