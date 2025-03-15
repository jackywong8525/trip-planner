const express = require('express');
const cors = require('cors');

// Hashing user's passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Issuing json web token
const jwt = require('jsonwebtoken');
const { privateKey, auth } = require('./auth/auth.js');

// Importing User model
const User = require('./models/user.js');

// Connecting to database
require("dotenv").config();
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL).catch((error) => {
    console.log(error.message);
})

const app = express();

app.use(express.json());
app.use(cors());

app.listen(5000, () => {
    console.log('server is listening to port 5000...')
})

app.post('/register', async (req, res) => {

    console.log('Request received');

    const { lastName, firstName, email, phone, username, password } = req.body;

    try {

        // Check whether the username is used
        const existedUser = await User.findOne({
            username: username 
        });

        if(existedUser){
            console.log('Username Exists');
            return res.status(200).json({
                success: false,
                message: 'Username already existed. Please use a different username.'
            });
        }
        

        // If no, save to the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            lastName: lastName,
            firstName: firstName,
            email: email,
            phone: phone,
            username: username,
            password: hashedPassword
        });

        await user.save();

        // The json method would directly attached to the response object as a *property* in the client side 
        res.status(201).json({
            success: true,
            message: 'User registered successfully.'
        })
        console.log('Request successful');

    } catch(error) {
        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'Registration failed. Please try again.',
        });
    }

})

app.post('/', async (req, res) => {

    try {

        console.log('Request received');

        const {username, password} = req.body;
        const user = await User.findOne({ 
            username: username 
        });

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'No such user exists. Please try again.'
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.status(400).json({
                success: false,
                message: 'The password is wrong. Please try again.'
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            privateKey,
            {expiresIn: '1h'}
        );

        console.log('Request Successful');
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        })

    } catch(error) {
        console.log('Request Failed');
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: 'Login failed. Please try again.',
        });
    }
});

app.get('/main', auth, (req, res) => {
    res.status(200).json({
        protected: true
    })
})

app.post('/add-trip/add-people', async (req, res) => {

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

})
