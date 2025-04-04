const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ownedTrips: [mongoose.Schema.Types.ObjectId],
    sharedTrips: [
        {
            tripId: mongoose.Schema.Types.ObjectId,
            isPending: Boolean
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
