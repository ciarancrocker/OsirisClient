import React, { Component } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { min as d3min, max as d3max } from 'd3-array';
import { scaleLinear } from 'd3-scale';

class LayoutView extends Component {
  SEAT_RADIUS = 10;

  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
    };

    this.onResize = this.onResize.bind(this);
  }

  onResize(width, height) {
    this.setState({ width, height });
  }

  render() {
    const { seats } = this.props;
    const { width, height } = this.state;

    const margin = this.SEAT_RADIUS * 2;

    let seatCircles = [];

    if(seats) {
      const xMin = d3min(seats, x => x.x_pos);
      const xMax = d3max(seats, x => x.x_pos);
      const yMin = d3min(seats, x => x.y_pos);
      const yMax = d3max(seats, x => x.y_pos);
  
      const xScale = scaleLinear()
        .domain([xMin, xMax])
        .range([margin, width - margin]);
      
      const yScale = scaleLinear()
        .domain([yMin, yMax])
        .range([margin, height - margin]);

      console.log({xMin, xMax, yMin, yMax });
  
      seatCircles = seats.map(seat => (
        <circle cx={xScale(seat.x_pos)}
          cy={yScale(seat.y_pos)}
          r={this.SEAT_RADIUS}
          fill="black"
          className={seat.user_id ? 'picked' : 'unpicked'}
          onClick={() => this.props.onSeatClick(seat.seat_id)}
          key={seat.seat_id} />
      ));
    }
    
    return (
      <div className='osirisLayoutView'>
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <svg>
          {seatCircles}
        </svg>
      </div>
    );
  }
}

export default LayoutView;