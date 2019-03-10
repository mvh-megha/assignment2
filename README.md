# assignment2

This project consists of 2 APIs

Server runs in 8080 port

1. {url}/getUsers
    This is the GET method API which doesn't take any request parameters
    Gets the data from the third party URL - GET(https://jsonplaceholder.typicode.com/users) and saves user data in database

2. {url}/postsAndComments
    This is the GET method API which doesn't take any request parameters
    Gets the data from third party URLs - 1. GET(https://jsonplaceholder.typicode.com/posts) for posts data and 2. GET(https://jsonplaceholder.typicode.com/comments) for comments data
    Maps comments to the respective posts
    Saves the posts along with the comments in the database

# Before running the project, follow the following points.

1. Clone the project from github repo - https://github.com/mvh-megha/assignment2
2. Run "npm install" in the project folder.

# To run the project in localhost, use the script below 
"npm start"
