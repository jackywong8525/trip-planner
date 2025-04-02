const jwt = require('jsonwebtoken');
const { privateKey, auth } = require('../auth/auth.js');

// Importing User model
const User = require('../models/user.js');
const Trip = require('../models/trip.js');

const findUsers = async (req, res) => {

    console.log('Request received Haha');

    const { username, token } = req.body;

    try {

        const requestedUser = await jwt.verify(token, privateKey);

        console.log(typeof requestedUser.userId);

        const userList = await User.find({$and:[
            {"username" : new RegExp(username, 'i')},
            {"_id" : { $ne: requestedUser.userId }}
        ]});


        const formattedUserList = userList
        .map((user) => {
            return {
                userId: user._id,
                lastName: user.lastName,
                firstName: user.firstName,
                username: user.username
            }
        });

        console.log(formattedUserList);

        return res.status(200).json({
            success: true,
            userList: formattedUserList
        });

    } catch(error) {
        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'Can\'t find users due to some reasons. Please try again.',
        });
    }

}

const getTrip = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await jwt.verify(token, privateKey);

        const trips = await Trip.find({ownerId: user.userId});

    } catch(error) {

    }
}

const addTrip = async (req, res) => {
    const { name, location, startDate, endDate, people, isChecklistShared, token } = req.body;

    try {

        const owner = await jwt.verify(token, privateKey);

        const trip = new Trip({
            ownerId: owner.userId,
            name: name,
            location: location, 
            startDate: startDate,
            endDate: endDate,
            people: people, 
            isChecklistShared: isChecklistShared
        });

        await trip.save();

        return res.status(200).json({
            success: true,
            message: "Trip successfully added."
        });

    } catch(error) {
        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'Can\'t add the trip due to some reasons. Please try again.',
        });
    }
}

const deleteTrip = async (req, res) => {
    const {tripId} = req.body;

    try{
        await Trip.findOneAndDelete({ _id: tripId });

        return res.status(200).json({
            success: true,
            message: "Trip successfully deleted."
        });

    } catch {
        res.status(400).json({
            success: false,
            message: 'Can\'t delete the trip due to some reasons. Please try again.',
        });
    }
    
}

module.exports = {
    findUsers,
    addTrip,
    deleteTrip
}