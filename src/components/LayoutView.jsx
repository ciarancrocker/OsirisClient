import { min as d3min, max as d3max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import React, { useCallback, useEffect, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useHistory, useParams } from 'react-router-dom';

import { API_URL } from '../app_config';
import { useUser } from '../contexts/UserContext';
import refreshLayoutSignal from '../signals/refreshLayout';

const SEAT_RADIUS = 10;

export default function LayoutView() {
    const { eventId, layoutId } = useParams();
    const history = useHistory();
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const { width, height, ref } = useResizeDetector();
    const user = useUser();

    const refreshLayout = useCallback(
        async () => {
            const eventSeatsRequest = await fetch(`${API_URL}/api/events/${eventId}/layouts/${layoutId}`);
            const eventSeats = await eventSeatsRequest.json();
            setSeats(eventSeats);
        },
        [eventId, layoutId]
    )

    useEffect(() => {
        refreshLayout();
    }, [eventId, layoutId, refreshLayout]);

    useEffect(() => {
        const signalBinding = refreshLayoutSignal.add(refreshLayout);

        return () => {
            refreshLayoutSignal.detach(signalBinding);
        }
    });

    function onSeatClick(seatId) {
        history.push(`/e/${eventId}/l/${layoutId}/s/${seatId}`);
        setSelectedSeat(seatId);
    }

    const margin = SEAT_RADIUS * 2;
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

    const seatCircles = seats.map(s => (
        <circle cx={xScale(s.x_pos)}
            cy={yScale(s.y_pos)}
            r={SEAT_RADIUS}
            fill="black"
            className={(s.user_id ? ((user && s.user_id === user.user_id) ? 'mine' : 'picked') : 'unpicked') + (s.seat_id === selectedSeat ? ' selected' : '')}
            onClick={() => onSeatClick(s.seat_id)}
            key={s.seat_id} />
    ));

    return (
        <div className='osirisLayoutView' ref={ref}>
            <svg>
                {seatCircles}
            </svg>
        </div>
    )
}