/**
 * This file contains APIs for
 * Get users from master database
 * Get posts from individual users database
 */

let { User } = require("../models/user.model")
let { dbArray } = require('../../helpers/syncDataHelper')

/**
 * This is API for creating Users
 * @param {*} request - accepts userId in query
 * @param {*} response 
 * @returns set of users from master database
 */
var getUsers = async function (request, response) {
    try {
        var dbResponse = [];
        if (request.query.userId)
            dbResponse = await User.findOne({ id: request.query.userId });
        else
            dbResponse = await User.find();
        response.send({ message: 'Success', users: dbResponse });
    } catch (error) {
        response.status(500).send({ message: "Internal Server Error", error: error });
    }
}

/**
 * This is the API getting posts and comments
 * request query will accept userId to get posts of particular user
 * @param {*} request 
 * @param {*} response 
 * @returns set of post data in users database
 */
var matchPostToComment = async function (request, response) {
    try {
        var dbResponse = [];
        if (request.query.userId) {
            dbResponse = await dbArray[request.query.userId - 1].models.posts.find();
        } else {
            for (var i = 0; i < dbArray.length; i++) {
                var tempResponse = await dbArray[i].models.posts.find();
                dbResponse = dbResponse.concat(tempResponse)
            }
        }
        response.send({ message: 'Success', posts: dbResponse });
    } catch (error) {
        response.status(500).send({ message: "Internal Server Error", error: error })
    }
}

module.exports = {
    getUsers,
    matchPostToComment
}
