import React, { Component } from 'react';

import refreshLayoutSignal from '../signals/refreshLayout';
import SeatView from '../presentation/SeatView';

import { API_URL } from '../app_config';

class SeatViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seat: { tag: 'Unknown' },
      user: null
    };

    this.getSeat = this.getSeat.bind(this);
    this.reserveSeat = this.reserveSeat.bind(this);
    this.releaseSeat = this.releaseSeat.bind(this);
    this.refreshSeat = this.refreshSeat.bind(this);
  }

  async getSeat(eventId, seatId) {
    const seatRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`);
    const seat = await seatRequest.json();
    this.setState({ seat });

    if(seat.user_id) {
      const userRequest = await fetch(`${API_URL}/api/users/${seat.user_id}`);
      const user = await userRequest.json();
      this.setState({ user });
    } else {
      this.setState({ user: null });
    }
  }

  async reserveSeat(seat) {
    const { eventId } = this.props.match.params;
    const seatId = seat.seat_id;
    if(!eventId) { return; }

    const seatReservationRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${this.props.jwt}`,
      },
    });
    const seatReservation = await seatReservationRequest.json();
    if(seatReservation.err) {
      switch(seatReservation.err) {
      case 'user_has_existing_reservation':
        alert('You already hold a reservation for this event! You must clear that reservation prior to reserving a new seat.');
        break;
      default:
        alert('An error occurred while setting your reservation. Please contact support if this error persists.');
        break;
      }
    } else {
      refreshLayoutSignal.dispatch();
      this.refreshSeat(); 
    }
  }

  async releaseSeat(seat) {
    const { eventId } = this.props.match.params;
    const seatId = seat.seat_id;
    if(!eventId) { return; }

    const seatReleaseRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.props.jwt}`,
      },
    });
    if(seatReleaseRequest.ok) {
      refreshLayoutSignal.dispatch();
      this.refreshSeat();
    }
  }
  
  refreshSeat() {
    const { seatId, eventId } = this.props.match.params;
    this.getSeat(eventId, seatId);
  }

  componentDidUpdate(oldProps) {
    if(
      oldProps.match.params.seatId !== this.props.match.params.seatId ||
      oldProps.match.params.eventId !== this.props.match.params.eventId
    ) {
      this.refreshSeat();
    }
  }

  componentDidMount() {
    this.refreshSeat();
  }

  render() {
    const { seat, user } = this.state;
    const auth = { };
    if(this.props.user) {
      auth.user = this.props.user;
    }

    console.log({ seat, user, auth });
    return <SeatView seat={seat} user={user} auth={auth} releaseSeat={this.releaseSeat} reserveSeat={this.reserveSeat} />;
  }
}

export default SeatViewContainer;