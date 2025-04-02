// Hashing user's passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Issuing json web token
const jwt = require('jsonwebtoken');
const { privateKey, auth } = require('../auth/auth.js');


// Importing User model
const User = require('../models/user.js');

const store = async (req, res, next) => {
    const { lastName, firstName, email, phone, username, password } = req.body;
    try {
      let user = new User({
        lastName,
        firstName,
        email,
        phone,
        username,
        password,
        ownedTrips: [],
        sharedTrips: []
      });
      const savedUser = await user.save();
      return res.json({
        message: 'User added successfully!',
      });
    } catch (error) {
      console.log(error)
      return res.json({
        message: 'An error occured!',
      });
    }
};


const register = async (req, res) => {

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
            password: hashedPassword,
            ownedTrips: [],
            sharedTrips: []
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

}

const login =  async (req, res) => {

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
}

module.exports = {
  register,
  login
}