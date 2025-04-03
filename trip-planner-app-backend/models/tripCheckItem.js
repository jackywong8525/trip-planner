const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemStatus = require('../objects/ItemStatus.js')

const tripCheckItemSchema = new Schema({
    checkItemId: { 
        type: Schema.Types.ObjectId, 
        ref: 'CheckItem' 
    },
    tripId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Trip' 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    deadline: Date,     
    itemStatus: ItemStatus
}, { timestamps: true });

const TripCheckItem = mongoose.model('TripCheckItem', tripCheckItemSchema);

module.exports = TripCheckItem;