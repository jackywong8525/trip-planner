const CheckItem = require('../models/checkItem.js');
const TripCheckItem = require('../models/tripCheckItem.js');

const jwt = require('jsonwebtoken');
const { privateKey, auth } = require('../auth/auth.js');

const addCheckItem = async (req, res) => {

    const { checkItemId, name, imageSource, tripId, userToken, deadline, itemStatus } = req.body;

    try {

        if(checkItemId === ""){

            const newCheckItem = new CheckItem({
                name: name,
                imageSource: imageSource
            });

            await newCheckItem.save();

            let checkItem = await CheckItem.findOne({ name: name });
            checkItemId = checkItem._id;
        }

        const currentUser = await jwt.verify(userToken, privateKey);

        const newTripCheckItem = new TripCheckItem({
            checkItemId: checkItemId,
            tripId: tripId,
            userId: currentUser._id,
            deadline: deadline,     
            itemStatus: itemStatus
        });

        await newTripCheckItem.save();

        // The json method would directly attached to the response object as a *property* in the client side 
        res.status(201).json({
            success: true,
            message: 'Checkitem Added.'
        })

    } catch(error) {
        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'The Checkitem cannot be added. Please try again.',
        });
    }
}