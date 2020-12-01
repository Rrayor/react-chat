const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    lastSignedInDate: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String,
        default: '#00FF88'
    }
});

module.exports = User = mongoose.model('user', UserSchema);