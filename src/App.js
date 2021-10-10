import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Authenticator from './Authenticator';
import EventList from './components/EventList';
import LayoutList from './components/LayoutList';
import LayoutView from './components/LayoutView';
import SeatView from './components/SeatView';

export default function App() {
  return (
    <Router>
      <div className='root'>
        <div className='osirisBar'>
          <h1>SGS Seat Picker</h1>
          <Authenticator />
        </div>
        <div className='osirisApp'>
          <Route path='/' component={EventList} />
          <Route path='/e/:eventId' component={LayoutList} />
          <Route path='/e/:eventId/l/:layoutId' component={LayoutView} />
          <Route path='/e/:eventId/l/:layoutId/s/:seatId' component={SeatView} />
        </div>
      </div>
    </Router>
  );
}
