import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import refreshLayoutSignal from '../signals/refreshLayout';

import LayoutView from '../presentation/LayoutView';
import { API_URL } from '../app_config';

class LayoutViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seats: [],
    };
    this.getSeats = this.getSeats.bind(this);
    this.onSeatClick = this.onSeatClick.bind(this);
    this.refreshLayout = this.refreshLayout.bind(this);

    refreshLayoutSignal.add(this.refreshLayout);
  }

  componentDidMount() {
    const { eventId, layoutId } = this.props.match.params;
    this.getSeats(eventId, layoutId);
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.match.params.eventId !== this.props.match.params.eventId ||
      oldProps.match.params.layoutId !== this.props.match.params.layoutId
    ) {
      const { eventId, layoutId } = this.props.match.params;
      if (eventId && layoutId) {
        this.getSeats(eventId, layoutId);
      } else {
        this.setState({
          seats: [],
        })
      }
    }
  }

  refreshLayout() {
    console.log('LayoutViewContainer#refreshLayout fired');
    const { eventId, layoutId } = this.props.match.params;
    this.getSeats(eventId, layoutId);
  }

  async getSeats(eventId, layoutId) {
    const eventSeatsRequest = await fetch(`${API_URL}/api/events/${eventId}/layouts/${layoutId}`);
    const eventSeats = await eventSeatsRequest.json() || [];
    this.setState({ seats: eventSeats });
  }

  onSeatClick(seatId) {
    const { eventId, layoutId } = this.props.match.params;
    this.props.history.push(`/e/${eventId}/l/${layoutId}/s/${seatId}`);
  }

  render() {
    return <LayoutView seats={this.state.seats} onSeatClick={this.onSeatClick} />;
  }
}

export default withRouter(LayoutViewContainer);