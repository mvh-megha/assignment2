/**
 * This file contains APIs for
 * Get users from master database
 * Get posts from individual users database
 */

let { User } = require("../models/user.model")
let { dbArray } = require('../../helpers/syncDataHelper')
var fs = require('fs')
var UUID = require('uuid')

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

/**
 * This is the API to update Avatar of the user
 * File and userID are mandatory
 * @param {*} request - accepts multipart form fata
 * @param {*} response 
 */
var updateAvatar = async function (request, response) {
    try {
        /** request validation */
        if (!request.body.userId) {
            return response.status(400).send({ message: "User ID is mandatory" })
        }

        /** Defining the destination file folder */
        var filePath = 'uploads/file' + UUID() + '.jpg'
        var inputFile = request.file.buffer ? request.file.buffer : null;

        /** writing the file in defined folder */
        fs.writeFile(filePath, inputFile, async (err) => {
            if (err) {
                console.log('there was an error while uploading the image', err)
                return response.status(500).send({ message: "error uploading file in server" })
            } else if (filePath != null) {
                /** Check for mime type of the file being uploaded */
                if (checkMimeType(filePath)) {
                    /** update the user document with the avatar folder path */
                    var uploaded = await updateAvatarInDb(filePath, request)
                    if (uploaded) {
                        console.log("Succesfully uploaded your file")
                        return response.send({ message: 'Successfully updated avatar' })
                    }
                    else {
                        console.log("Unable to upload avatar in db, try again in sometime")
                        return response.status(500).send({ message: "error uploading file in db" })
                    }
                }
                /** if file type id other than image */
                else {
                    console.log("file type is not supported")
                    return response.status(400).send({ message: "Please use only image type files" })
                }
            } else {
                return response.status(400).send({ message: "Image is mandatory" })
            }
        })
    } catch (error) {
        return response.status(500).send({ message: "Internal server error", error: error })
    }
}

/**
 * This function checks the mime type of the file
 * @param {*} filePath - local file path in the server
 * @returns mime type of the file
 */
var checkMimeType = function (filePath) {
    /* mime type check */
    let uint = fs.readFileSync(filePath)
    const hex = uint.toString('hex');
    const signature = hex.slice(0, 8)
    switch (signature.toUpperCase()) {
        case '89504E47':
            return 'image/png'
        case 'FFD8FFDB':
        case 'FFD8FFE0':
        case 'FFD8FFE1':
            return 'image/jpeg'
        default:
            return false;
    }
}

/**
 * This function is to update the user document in the database
 * @param {*} filePath - local file path
 * @param {*} request - API request
 */
var updateAvatarInDb = async function (filePath, request) {
    return new Promise((resolve, reject) => {
        try {
            /** create object with updated fields of user */
            var updateObject = {
                avatar: filePath
            }

            /** Database call */
            User.findOneAndUpdate({ id: request.body.userId }, updateObject, (err, res) => {
                if (err) {
                    console.log('error in db update of avatar', error)
                    resolve(false);
                }
                resolve(res);
            })
        } catch (error) {
            console.log('error in db update of avatar', error)
            resolve(false);
        }
    })
}

module.exports = {
    getUsers,
    matchPostToComment,
    updateAvatar
}
