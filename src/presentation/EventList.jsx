import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EventList extends Component {
  render() {
    const eventElements = this.props.events.map(event => (
      <div className='osirisEvent' key={event.event_id}>
        <Link to={`/e/${event.event_id}`}>{event.name}</Link>
      </div>
    ));
    return (
      <div className='osirisEventSelect'>
        {eventElements}
      </div>
    )
  }
}

export default EventList;