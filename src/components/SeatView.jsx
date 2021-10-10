import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import refreshLayoutSignal from '../signals/refreshLayout';
import SeatService from '../services/SeatService';
import { useUser } from '../contexts/UserContext';
import { useAuthentication } from '../contexts/AuthenticationContext';

export default function SeatView() {
    const { eventId, seatId } = useParams();
    const [seat, setSeat] = useState({ tag: 'Unknown', user: undefined });
    const user = useUser();

    const refreshSeat = useCallback(
        async () => {
            var seatService = new SeatService({});
            var seat = await seatService.getSeat(eventId, seatId);
            setSeat(seat);
        },
        [eventId, seatId]
    );

    useEffect(() => {
        refreshSeat();
    }, [eventId, seatId, refreshSeat]);

    let detailComponent;
    if (seat.user) { // seat is picked
        if (user && seat.user.user_id === user.user_id) { // seat is picked by us
            detailComponent = <MySeat seat={seat} refreshSeat={refreshSeat} />;
        } else { // seat is picked by someone else
            detailComponent = <ReservedSeat seat={seat} />;
        }
    } else {
        detailComponent = <ReservableSeat seat={seat} refreshSeat={refreshSeat} />;
    }

    return (
        <div className='osirisSeatView'>
            <h1>Seat {seat.tag}</h1>
            {detailComponent}
        </div>
    );
}

function ReservableSeat({ seat, refreshSeat }) {
    const { seat_id: seatId } = seat;
    const { eventId } = useParams();
    const authentication = useAuthentication();

    const canReserve = authentication.jwt && authentication.user;

    async function reserveSeat() {
        var seatService = new SeatService(authentication);
        var reserveRequest = await seatService.reserveSeat(eventId, seatId);
        if (reserveRequest) {
            refreshSeat();
            refreshLayoutSignal.dispatch();
        }
    }

    return (
        <div>
            <p>This seat is available. It could be yours!</p>
            <button onClick={reserveSeat} disabled={!canReserve}>Reserve</button>
        </div>
    )
}

function MySeat({ seat, refreshSeat }) {
    const { seat_id: seatId } = seat;
    const { eventId } = useParams();
    const authentication = useAuthentication();

    async function releaseSeat() {
        var seatService = new SeatService(authentication);
        var releaseRequest = await seatService.releaseSeat(eventId, seatId);
        if (releaseRequest) {
            refreshSeat();
            refreshLayoutSignal.dispatch();
        }
    }

    return (
        <div>
            <img src={seat.user.profile_url} alt={seat.user.tag} className='osirisProfileImg' />
            <p>This is your seat!</p>
            <button onClick={releaseSeat}>Release</button>
        </div>
    );
}

function ReservedSeat({ seat }) {
    return (
        <div>
            <img src={seat.user.profile_url} alt={seat.user.tag} className='osirisProfileImg' />
            <p>This seat has been picked by {seat.user.tag}</p>
        </div>
    )
}