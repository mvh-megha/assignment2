/**
 * This file contains model defination for Posts and comments
 */

var postSchemaObject = {
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
}

module.exports = { postSchemaObject }