import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../app_config';

export default function LayoutList() {
    const { eventId } = useParams();
    const [layouts, setLayouts] = useState([]);
    useEffect(() => {
        (async () => {
            if(eventId) {
                const eventFetch = await fetch(`${API_URL}/api/events/${eventId}`);
                const event = await eventFetch.json();
                setLayouts(event.layouts);
            }
        })();
    }, [eventId]);
    const layoutElements = layouts.map(l => (
        <div className='osirisLayout' key={l.layout_id}>
            <Link to={`/e/${eventId}/l/${l.layout_id}`}>{l.name}</Link>
        </div>
    ));
    return (
        <div className='osirisLayoutSelect'>
            {layoutElements}
        </div>
    )
}