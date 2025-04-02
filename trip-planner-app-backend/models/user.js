const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    lastName: String,
    firstName: String,    
    email: String,
    phone: String,
    username: String,
    password: String,
    ownedTrips: Array,
    sharedTrips: Array
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
