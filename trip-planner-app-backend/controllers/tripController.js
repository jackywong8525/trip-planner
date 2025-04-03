const mongoose = require('mongoose');
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

const getOwnedTripsByUserId = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await jwt.verify(token, privateKey);

        const trips = await Trip.find({ownerId: user.userId});

        return res.status(200).json({
            success: true,
            trips: trips,
            message: "Trips retrieved successfully."
        });

    } catch(error) {
        res.status(400).json({
            success: false,
            message: 'Can\'t get the trip due to some reasons. Please try again.',
        });
    }
}

const addTrip = async (req, res) => {
    const { name, location, startDate, endDate, people, isChecklistShared, token } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

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

        await trip.save({ session });

        await User.findByIdAndUpdate(
            owner._id,
            { $push: {ownedTrips: trip._id} },
            { 
                new: true,
                session
            }
        )

        await Promise.all(
            people.map(async (personId) => {
                await User.findByIdAndUpdate(
                    personId,
                    { $push: { sharedTrips: trip._id } },
                    { session }
                );
            })
        );

        await session.commitTransaction();
        session.endSession();
      

        return res.status(200).json({
            success: true,
            message: "Trip successfully added."
        });

    } catch(error) {

        await session.abortTransaction();
        session.endSession();

        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'Can\'t add the trip due to some reasons. Please try again.',
        });
    }
}

const deleteTrip = async (req, res) => {
    const {token, tripId} = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const user = await jwt.verify(token, privateKey);

        const trip = Trip.findById(tripId);
        const { ownerId, people } = trip;

        if(ownerId !== user.userId){
            return res.status(400).json({
                success: false,
                message: 'Can\'t delete the trip that is not owned by the user.',
            });
        }

        await Trip.findByIdAndDelete(tripId, {session});

        await User.findByIdAndUpdate(
            ownerId,
            {
                $pull: {
                    ownedTrips: { $in: tripId }
                }
            },
            { session }
        )

        await Promise.all(
            people.map(async (personId) => {
                await User.findByIdAndUpdate(
                    personId,
                    { $pull: { sharedTrips: tripId } },
                    { session }
                );
            })
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Trip successfully deleted."
        });

    } catch {
        await session.abortTransaction();
        session.endSession();

        console.log(error.message);

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