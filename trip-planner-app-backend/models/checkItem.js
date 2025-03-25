const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkItemSchema = new Schema({
    name: String,
    imageSource: String
}, { timestamps: true });

const CheckItem = mongoose.model('CheckItem', checkItemSchema);

module.exports = CheckItem;