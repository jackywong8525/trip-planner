const jwt = require('jsonwebtoken');
const { privateKey, auth } = require('../auth/auth.js');

// Importing User model
const User = require('../models/user.js');

const addTrip = async (req, res) => {

    console.log('Request received Haha');

    const { username, token } = req.body;

    try {

        const requestedUser = await jwt.verify(token, privateKey);

        const userList = await User.find({$and:[
            {"username" : new RegExp(username, 'i')},
            {"" : { $ne: requestedUser.userId }}
        ]});


        const formattedUserList = userList
        .map((user) => {
            return {
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

module.exports = {
    addTrip
}