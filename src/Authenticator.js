import React, { Component } from 'react';

import { openAuthenticationPopup, listenForAuthentication } from './util/popupUtils';
import { API_URL } from './app_config';

class Authenticator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.onLoginClick = this.onLoginClick.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.refreshUser = this.refreshUser.bind(this);
  }
  
  async onLoginClick() {
    const loginPopup = openAuthenticationPopup();
    const jwt = await listenForAuthentication(loginPopup);
    this.props.login(jwt);
  }

  onLogoutClick() {
    this.props.logout();
  }

  async refreshUser(jwt) {
    if(jwt) { // user is logging in
      try {
        const userRequest = new Request(`${API_URL}/api/users/@me`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const userFetch = await fetch(userRequest);
        const user = await userFetch.json();
        this.setState({ user });
      } catch (e) {
        // there's an issue with the JWT, nuke it and start again
        this.setState({ user: null });
        this.props.logout();
      }
    } else { // user is logging out
      this.setState({ user: null });
    }

  }

  componentDidMount() {
    this.refreshUser(this.props.jwt);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.jwt !== this.props.jwt) {
      this.refreshUser(newProps.jwt);
    }
  }

  render() {
    if(this.state.user) { // loggedIn
      const { user } = this.state;
      return (
        <div className='osirisAuthentication'>
          <img src={user.profile_url} alt={user.tag} className='osirisLoggedInUserImg' />
          You are logged in as {user.tag}
          <button onClick={this.onLogoutClick}>Logout</button>
        </div>
      );
    } else { // !loggedIn
      return (
        <div className='osirisAuthentication'>
          <button onClick={this.onLoginClick}>Login</button>
        </div>
      );
    }
  }
}

export default Authenticator;
