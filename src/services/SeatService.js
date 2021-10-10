import { API_URL } from "../app_config";

export default class SeatService {
    constructor({jwt} = {jwt: undefined}) {
        this.jwt = jwt;
    }

    async getSeat(eventId, seatId) {
        const seatRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`);
        const seat = await seatRequest.json();
        if (seat.user_id) {
            const userRequest = await fetch(`${API_URL}/api/users/${seat.user_id}`);
            const user = await userRequest.json();
            seat.user = user;
        }
        return seat;
    }

    async reserveSeat(eventId, seatId) {
        this._checkAuthentication();
        const seatReservationRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.jwt}`,
            },
        });
        const seatReservation = await seatReservationRequest.json();
        console.log(seatReservation);
        if(seatReservation.status === 'err') {
            switch (seatReservation.err) {
                case 'user_has_existing_reservation':
                    alert('You already hold a reservation for this event. You must clear that reservation prior to reserving a new seat.');
                    break;
                default:
                    alert('An error occurred while setting your reservation.');
                    break;
            }
            return false;
        } else {
            return true;
        }
    }

    async releaseSeat(eventId, seatId) {
        this._checkAuthentication();
        const seatReleaseRequest = await fetch(`${API_URL}/api/events/${eventId}/seat/${seatId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.jwt}`,
            },
        });
        return seatReleaseRequest.ok;
    }

    _checkAuthentication() {
        if(!this.jwt) {
            throw new Error('This method required authentication.');
        }
    }
}