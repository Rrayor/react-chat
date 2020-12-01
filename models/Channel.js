const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'unnamed'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    whitelist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    blacklist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    creationDate: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            type: Object,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            message: {
                type: String
            },
            sentDate: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = Channel = mongoose.model('channel', ChannelSchema);