const express = require('express');
const cors = require('cors');

const mainRoute = require('./routes/mainRoute.js');
const userRoute = require('./routes/userRoute.js');

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

// Authentication
app.use('/auth', userRoute);

// Routes
app.use('/main', mainRoute);

// Activate server listener
app.listen(5000, () => {
    console.log('server is listening to port 5000...')
})