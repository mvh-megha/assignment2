/**
 * This file contains controllers for 
 * get all users
 * get all posts
 * get all comments and add to posts
 */

let { User } = require("../models/user.model")
let { Posts } = require("../models/posts.model")
let commonUtility = require("../utility/commonUtility")

/**
 * This is API for creating Users
 * @param {*} request 
 * @param {*} response 
 * @returns set of users created in database
 */
var getUsers = async function (request, response) {
    try {
        /** HTTP request to get users data from the 3rd party URL */
        var optionsObject = commonUtility.getOptionsObject('/users');
        var httpResponse = await commonUtility.httpRequest(optionsObject);
        /** Database Operation */
        var dbResponse = await saveUsersToDb(httpResponse.data);
        response.send(dbResponse);
    } catch (error) {
        response.status(500).send({ message: "Internal Server Error", error: error });
    }
}

/**
 * This is the API for matching posts and comments
 * @param {*} request 
 * @param {*} response 
 * @returns set of data created in db for posts after matching comments
 */
var matchPostToComment = async function (request, response) {
    try {
        /** HTTP request to get posts data from the 3rd party URL */
        var postsOptionsObject = commonUtility.getOptionsObject('/posts');
        var postsHttpResponse = await commonUtility.httpRequest(postsOptionsObject);
        /** HTTP request to get comments data from the 3rd party URL */
        var commentsOptionsObject = commonUtility.getOptionsObject('/comments');
        var commentsHttpResponse = await commonUtility.httpRequest(commentsOptionsObject);
        /** Matching comments and posts */
        var dataObject = await matchPostsToComments(postsHttpResponse.data, commentsHttpResponse.data);
        /** Database Operation */
        var dbResponse = await savePostsToDb(dataObject);
        response.send(dbResponse);
    } catch (error) {
        response.status(500).send({ message: "Internal Server Error", error: error })
    }
}

/**
 * This function saves user data in User database 
 * @param {*} data - data array of users for bulk insertion
 * @returns database response
 */
var saveUsersToDb = async function (data) {
    return new Promise(async (resolve, reject) => {
        try {
            /** Bulk insertion operation */
            User.insertMany(data, { ordered: false }, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * This function is to match posts with the corresponding comments
 * @param {*} posts - Posts array
 * @param {*} comments - comments array
 * @returns matched result array
 */
var matchPostsToComments = async function (posts, comments) {
    return new Promise((resolve, reject) => {
        try {
            var resultArray = [];
            for (var i = 0; i < posts.length; i++) {
                /** mapping each comment for matching posts */
                var commentsData = comments.filter(function (obj) {
                    return posts[i].id === obj.postId;
                });
                /** creating object ready to be inserted in database */
                var mappedObject = {
                    id: posts[i].id,
                    userId: posts[i].userId,
                    title: posts[i].title,
                    body: posts[i].body,
                    comments: commentsData
                }
                resultArray.push(mappedObject);
            }
            /** return the resultant array */
            resolve(resultArray);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * This function is to save posts and corresponding comments in the database
 * @param {*} data - data array of posts for bulk insert
 * @returns database response
 */
var savePostsToDb = async function (data) {
    return new Promise(async (resolve, reject) => {
        try {
            /** Bulk insertion operation */
            Posts.insertMany(data, { ordered: false }, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getUsers,
    matchPostToComment
}
