import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ApplicationProviders from './ApplicationProviders';
import { unregister } from './registerServiceWorker';

ReactDOM.render(
    <ApplicationProviders>
        <App />
    </ApplicationProviders>, 
    document.getElementById('root')
);
//registerServiceWorker();
unregister(); // service worker can fuck off for now
