import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Authenticator from './Authenticator';
import EventList from './containers/EventList';
import LayoutList from './containers/LayoutList';
import LayoutView from './containers/LayoutView';
import SeatView from './containers/SeatView';

import { API_URL } from './app_config';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: window.localStorage.getItem('Osiris2_JWT'),
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
  }

  async login(jwt) {
    this.setState({jwt});
    window.localStorage.setItem('Osiris2_JWT', jwt);
    this.fetchUser(jwt);
  }

  async fetchUser(jwt) {
    const userRequest = await fetch(`${API_URL}/api/users/@me`,
      {
        headers: {
          authorization: `Bearer ${jwt}`,
        }
      });
    const user = await userRequest.json();
    this.setState({ user });
  }

  logout() {
    this.setState({ jwt: null, user: null });
    window.localStorage.removeItem('Osiris2_JWT');
  }

  componentDidMount() {
    if(this.state.jwt) { // load the user info
      this.fetchUser(this.state.jwt);
    }
  }

  render() {
    return (
      <Router>
        <div className='root'>
          <div className='osirisBar'>
            <h1>SGS Seat Picker</h1>
            <Authenticator login={this.login} logout={this.logout} jwt={this.state.jwt} />
          </div>
          <div className='osirisApp'>
            <Route path='/' component={EventList} />
            <Route path='/e/:eventId' component={LayoutList} />
            <Route path='/e/:eventId/l/:layoutId' component={LayoutView} />
            <Route path='/e/:eventId/l/:layoutId/s/:seatId' component={(props) => <SeatView {...props} jwt={this.state.jwt} user={this.state.user} />} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
