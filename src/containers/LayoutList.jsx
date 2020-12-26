import React, { Component } from 'react';
import { API_URL } from '../app_config';

import LayoutList from '../presentation/LayoutList';

class LayoutListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layouts: [],
      event: null,
    };
  }

  async refreshLayouts(eventId) {
    const eventFetch = await fetch(`${API_URL}/api/events/${eventId}`);
    const event = await eventFetch.json();
    this.setState({
      layouts: event.layouts,
      event: eventId,
    });
  }

  async componentDidMount() {
    const eventId = this.props.match.params.eventId;
    await this.refreshLayouts(eventId);
  }

  async componentDidUpdate(prevProps) {
    if(this.props.match.params.eventId !== prevProps.match.params.eventId) {
      await this.refreshLayouts(this.props.match.params.eventId);
    }
  }

  render() {
    return <LayoutList layouts={this.state.layouts} eventId={this.state.event} />;
  }

}

export default LayoutListContainer;