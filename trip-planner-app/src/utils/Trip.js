import AuthService from "@/auth/AuthService";
import { API_URL } from "./backendConnection";

const loadTripPeople = async (trip, except) => {

    const responses = await Promise.all(trip.people.map(
        (personId) => {
            return fetch(API_URL + '/user/find-user-by-userId', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthService.getCurrentUser()}`
                },
                body: JSON.stringify({
                    userId: personId
                })
            });
        }
    ));

    const usernames = await Promise.all(
        responses
            .map(async (response) => {
                const responseObj = await response.json();
                return responseObj.user.username;
            })
    );

    return usernames.filter((username) => {
        return except.username !== username;
    });
}

const deleteTrip = async (trip) => {

    console.log(trip);

    const response = await fetch(API_URL + '/main/trip/delete-trip', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            token: AuthService.getCurrentUser(),
            tripId: trip._id
        })
    });


    const responseObj = await response.json();

    return responseObj;
}

const getTripByTripId = async(tripId) => {
    const response = await fetch(API_URL + '/main/trip/get-trip-by-tripId', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            tripId: tripId
        })
    });

    const responseObj = await response.json();

    return responseObj.trip;
}

export {
    loadTripPeople,
    getTripByTripId,
    deleteTrip
}