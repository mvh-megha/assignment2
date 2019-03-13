/**
 * This file contains model defination for user schema
 */

const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: {
            type: String
        },
        suite: {
            type: String
        },
        city: {
            type: String
        },
        zipcode: {
            type: String
        },
        geo: {
            lat: {
                type: String
            },
            lng: {
                type: String
            }
        }
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    company: [{
        name: {
            type: String
        },
        catchPhrase: {
            type: String
        },
        bs: {
            type: String
        }
    }],
    avatar: {
        type: String,
        default: ''
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User }