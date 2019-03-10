/**
 * This file contains model defination for Posts and comments
 */

const mongoose = require('mongoose');

var PostsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    userId: {
        type: Number,
        required: true
    },
    title: {
        type: String
    },
    body: {
        type: String
    },
    comments: [{
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        body: {
            type: String
        }
    }]
});

var Posts = mongoose.model('Posts', PostsSchema);

module.exports = { Posts }