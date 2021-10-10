import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {API_URL} from '../app_config';

export default function EventList(props) {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        (async () => {
            const eventsFetch = await fetch(`${API_URL}/api/events`);
            const events = await eventsFetch.json();
            setEvents(events);
        })();
    }, []);
    const eventElements = events.map(e => (
        <div className='osirisEvent' key={e.event_id}>
            <Link to={`/e/${e.event_id}`}>{e.name}</Link>
        </div>
    ));
    return (
        <div className='osirisEventSelect'>
            {eventElements}
        </div>
    );
}