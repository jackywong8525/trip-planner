require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const privateKey = process.env.PRIVATE_KEY;

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, privateKey);
        req.user = decoded;

        console.log(decoded);
        
        const user = await User.findById(decoded.userId);

        if(user){
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: error
        })
    }

    catch(error) {
        console.log(error);

        res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: error
        });
    }
}

module.exports = {
    privateKey,
    auth
};