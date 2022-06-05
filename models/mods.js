const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const modSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    modId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Mod = new mongoose.model('Mod',modSchema);
module.exports = Mod; 