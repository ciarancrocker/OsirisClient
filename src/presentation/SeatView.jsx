import React, { Component } from 'react';

class SeatView extends Component {
  render() {
    const { auth, seat, user } = this.props;
    let seatComponent;
    if(user) { // seat is picked
      if(auth.user && seat.user_id == auth.user.user_id) { // seat is picked by self
        seatComponent = <SelfPickedSeat user={user} onReleaseClick={() => this.props.releaseSeat(seat)} />
      } else { // seat is picked by other user
        seatComponent = <PickedSeat user={user} />;
      }
    } else { // seat is unpicked
      seatComponent = <UnpickedSeat onReserveClick={() => this.props.reserveSeat(seat)} canReserve={auth.user ? true : false} />;
    }

    return (
      <div className='osirisSeatView'>
        <h1>Seat {seat.tag}</h1>
        {seatComponent}
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