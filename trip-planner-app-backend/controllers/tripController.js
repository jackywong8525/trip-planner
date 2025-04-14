const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { privateKey, auth } = require('../auth/auth.js');

// Importing User model
const User = require('../models/user.js');
const Trip = require('../models/trip.js');

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

const getSharedTripsByUserId = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await jwt.verify(token, privateKey);

        const userObj = await User.findById(user.userId);

        const sharedTrips = await Promise.all(userObj.sharedTrips.map(async (sharedTrip) => {
            return {
                trip: await Trip.findById(sharedTrip.tripId),
                isPending: sharedTrip.isPending
            };
        }));

        return res.status(200).json({
            success: true,
            trips: sharedTrips.filter((sharedTrip) => { return sharedTrip !== null }),
            message: "Trips retrieved successfully."
        });

    } catch(error) {
        res.status(400).json({
            success: false,
            message: 'Can\'t get the trip due to some reasons. Please try again.',
        });
    }
}

const confirmTripInvitation = async (req, res) => {
    const { userId, tripId, isAccepted } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        if(isAccepted){

            console.log(userId, tripId, isAccepted)
            
            const result = await User.findOneAndUpdate(
                // query based on userId and tripId in sharedTrips (mandatory)
                { _id: userId, "sharedTrips.tripId": tripId },
                {
                    $set: { "sharedTrips.$.isPending": false }
                },
                { 
                    new: true,
                    session
                }
            );

            await session.commitTransaction();
            session.endSession();
    
            if(result) {
                return res.status(200).json({
                    success: true,
                    message: "Trip invitation is accepted successfully."
                });
            }
            
            console.log(result);
            return res.status(400).json({
                success: false,
                message: "Trip invitation cannot be accepted."
            });
        }
    
        else {

            const resultFromUser = await User.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        sharedTrips: { tripId: tripId }
                    }
                },
                { 
                    new: true,
                    session 
                }
            )

            const resultFromTrip = await Trip.findByIdAndUpdate(
                tripId,
                {
                    $pull: {
                        people: userId
                    }
                },
                { 
                    new: true,
                    session
                }
            )

            await session.commitTransaction();
            session.endSession();

            if(resultFromUser && resultFromTrip) {
                return res.status(200).json({
                    success: true,
                    message: "Trip invitation is declined successfully."
                });
            }

            return res.status(200).json({
                success: false,
                message: "Trip invitation cannot be declined."
            });
        }

    } catch(error) {
        await session.abortTransaction();
        session.endSession();

        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'Can\'t accept/decline trip invitation due to some reasons. Please try again.',
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
            owner.userId,
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
                    { $push: { sharedTrips: {tripId: trip._id, isPending: true} } },
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
                    ownedTrips: tripId
                }
            },
            { session }
        )

        await Promise.all(
            people.map(async (personId) => {
                await User.findByIdAndUpdate(
                    personId,
                    { $pull: { sharedTrips: { $in: { tripId: tripId } } } },
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
    addTrip,
    deleteTrip,
    getOwnedTripsByUserId,
    getSharedTripsByUserId,
    confirmTripInvitation
}