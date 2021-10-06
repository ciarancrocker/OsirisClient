import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LayoutList extends Component {
  render() {
    const layoutElements = this.props.layouts.map(layout => (
      <div className='osirisLayout' key={layout.layout_id}>
        <Link to={`/e/${this.props.eventId}/l/${layout.layout_id}`}>{layout.name}</Link>
      </div>
    ));
    return (
      <div className='osirisLayoutSelect'>
        {layoutElements}
      </div>
    );
  }
}

export default LayoutList;