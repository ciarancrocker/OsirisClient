import React, { Component } from 'react';

import { API_URL } from './app_config';

class SeatView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seat: { tag: 'Unknown' },
      user: null,
    };

    this.getSeat = this.getSeat.bind(this);
    this.reserveSeat = this.reserveSeat.bind(this);
    this.releaseSeat = this.releaseSeat.bind(this);
  }

  async getSeat(eventId, seatId) {
    const seatRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`);
    const seat = await seatRequest.json();
    this.setState({ seat });

    if(seat.user_id) { // seat is picked, get user
      const userRequest = await fetch(`${API_URL}/api/users/${seat.user_id}`);
      const user = await userRequest.json();
      this.setState({ user });
    } else { // clear a user if there is one
      this.setState({ user: null });
    }
  }

  async reserveSeat(eventId, seatId) {
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
      window.location.reload();
    }
  }

  async releaseSeat(eventId, seatId) {
    const seatReleaseRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.props.jwt}`,
      },
    });
    if(seatReleaseRequest.ok) {
      window.location.reload();
    }
  }

  componentDidMount() {
    const { eventId, seatId } = this.props.match.params;
    this.getSeat(eventId, seatId);
  }

  componentWillReceiveProps(newProps) {
    const oldEventId = this.props.match.params.eventId;
    const oldSeatId = this.props.match.params.seatId;
    const { eventId, seatId } = newProps.match.params;
    if(oldEventId !== eventId || oldSeatId !== seatId) {
      this.getSeat(eventId, seatId);
    }
  }

  render() {
    const { seat, user } = this.state;
    const { eventId, seatId } = this.props.match.params;
    let seatDetails = null;
    if(user) { // seat is picked
      if(this.props.user && user.user_id === this.props.user.user_id) { // seat is picked by this user
        seatDetails = <SelfPickedSeat user={user} onReleaseClick={() => this.releaseSeat(eventId, seatId)} />;
      } else { // seat is picked by someone else
        seatDetails = <PickedSeat user={user} />;
      }
    } else { // seat is unpicked
      seatDetails = <UnpickedSeat onReserveClick={() => this.reserveSeat(eventId, seatId)} canReserve={this.props.user ? true : false} />;
    }

    return (
      <div className='osirisSeatView'>
        <h1>Seat {seat.tag}</h1>
        {seatDetails}
      </div>
    );
  }
}

function UnpickedSeat(props) {
  return (
    <div>
      <p>This seat is available. It could be yours!</p>
      <button onClick={props.onReserveClick} disabled={!props.canReserve}>Reserve</button>
    </div>
  );
}

function PickedSeat(props) {
  return (
    <div>
      <img src={props.user.profile_url} alt={props.user.tag} className='osirisProfileImg' />
      <p>This seat has been picked by {props.user.tag}</p>
      <button disabled>Request this seat</button>
    </div>
  );
}

function SelfPickedSeat(props) {
  return (
    <div>
      <img src={props.user.profile_url} alt={props.user.tag} className='osirisProfileImg' />
      <p>This is your seat!</p>
      <button onClick={props.onReleaseClick}>Release</button>
    </div>
  );
}


export default SeatView;
