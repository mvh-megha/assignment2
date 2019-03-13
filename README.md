# assignment2

This is the functonality of the Project.

####Service to fetch users, posts and comments from 3rd party APIs
1. This project runs a service as soon as launched and fetches users, posts and comments from 3rd party APIs.
2. Stores user list in master database in collection 'users'.
3. Creates seperate databases for each users fetched in step 1.
4. Initializes schema for posts in each user's database.
5. Maps all posts and comments and stores in respective user's database.

####APIs####
1. Get all users. {url}/getUsers
..* This API takes an optional query parameter. i.e., userId
..* When userId is given, API will respond with the details of the particular user.
..* If userId is not given, API will respond with details of all users.

2. Get all posts. {url}/postsAndComments
..* This API takes an optional query parameter. i.e., userId
..* When userId is given, API will respond with posts of particular user.
..* When userId is not given, API will respond with all posts grouped by userId

####prerequisites####
1. NodeJS
2. NPM
3. MongoDB

####Steps to follow before running the project####
1. Clone the project using the following command `git clone https://github.com/mvh-megha/assignment2`
2. Navigate to the project directory and run `npm install`
3. Run `npm start` to run the project and initiate the server.
4. Use APIs and have fun.