let commonUtility = require('../app/utility/commonUtility')
let { User } = require("../app/models/user.model")
const mongoose = require('mongoose');
let { postSchemaObject } = require("../app/models/posts.model")
var dbArray = [];
/**
 * This is function for creating Users
 */
var getAndSToreAllUsers = async function () {
    try {
        var checkUsers = await User.find();
        if (!checkUsers.length) {
            /** HTTP request to get users data from the 3rd party URL */
            var optionsObject = commonUtility.getOptionsObject('/users');
            var httpResponse = await commonUtility.httpRequest(optionsObject);
            await saveUsersToDb(httpResponse.data);
            await createDatabasesForUsers(httpResponse.data);
            await matchPostToComment(httpResponse.data)
        } else {
            return;
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * This is the API for matching posts and comments
 * @param {*} request 
 * @param {*} response 
 * @returns set of data created in db for posts after matching comments
 */
var matchPostToComment = async function (userData) {
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
        await matchUserAndPosts(dataObject, userData);
    } catch (error) {
        console.log(error)
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
 * This function creates different databases for each users.
 * example: id:1, dbName: user1
 * @param {*} userData - user array
 * after creating db for each user, this also creates  collection inside all db called posts
 */
var createDatabasesForUsers = async function (userData) {
    try {
        for (var i = 0; i < userData.length; i++) {
            console.log("yep came here")
            dbArray[i] = mongoose.createConnection(`mongodb://localhost/user${userData[i].id}`);
            var posts = dbArray[i].model('posts', new mongoose.Schema(postSchemaObject))
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * This function matches all posts belonging to particular user
 * saves posts of a user in his database
 * @param {*} postData - posts array mapped to comments
 * @param {*} userData - user array
 */
var matchUserAndPosts = async function (postData, userData) {
    try {
        for (var i = 0; i < userData.length; i++) {
            var userPosts = postData.filter((post) => {
                return userData[i].id === post.userId
            })
            var dbName = dbArray[i]
            dbName.models.posts.insertMany(userPosts, { ordered: false }, (err, dbResponse) => {
                if (err) {
                    console.log("yep error", err)
                } else {
                    console.log("yep data", dbResponse)
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Main entry point to sync all data of users, posts and comments
 */
var syncData = function () {
    try {
        return getAndSToreAllUsers();
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    syncData,
    dbArray
}
