import AuthService from "@/auth/AuthService";

const loadTripPeople = async (trip) => {

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
        responses.map(async (response) => {
            const responseObj = await response.json();
            return responseObj.user.username;
        })
    );

    return usernames;
}