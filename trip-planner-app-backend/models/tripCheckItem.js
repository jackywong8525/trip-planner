const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemStatus = require('../objects/ItemStatus.js')

const tripCheckItemSchema = new Schema({
    checkItemId: String,
    tripId: String,
    userId: String,
    deadline: Date,     
    itemStatus: ItemStatus
}, { timestamps: true });

const TripCheckItem = mongoose.model('TripCheckItem', tripCheckItemSchema);

module.exports = TripCheckItem;