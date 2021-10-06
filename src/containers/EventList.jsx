import React, { Component } from 'react';
import EventListPresentation from '../presentation/EventList';

import { API_URL } from '../app_config';

class EventListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };

    this.fetchEvents = this.fetchEvents.bind(this);
  }

  async fetchEvents() {
    const eventsFetch = await fetch(`${API_URL}/api/events`);
    const events = await eventsFetch.json();
    this.setState({ events });
  }

  async componentDidMount() {
    await this.fetchEvents();
  }

  render() {
    return <EventListPresentation events={this.state.events} />;
  }
}

export default EventListContainer;