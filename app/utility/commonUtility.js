const http = require('http')

/**
 * This function is to make http request
 * @param {*} requestOptions - headers
 * @param {*} body - request body
 * This function makes http request as required and returns the response of the http request
 * @returns response of the http request
 */
var httpRequest = async function (requestOptions) {
    try {
        return new Promise((resolve, reject) => {
            var postRequest = http.request(requestOptions, function (res) {
                res.setEncoding('utf8');
                var data = "";
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    if (res.statusCode == 200) {
                        data = JSON.parse(data);
                        resolve({ "code": "200", "data": data });
                    }
                    else {
                        resolve({ "code": res.statusCode, "errorResp": data });
                    }

                });
            })
            postRequest.on('error', (e) => {
                throw e;
            });
            postRequest.end();
        });

    } catch (e) {
        throw e;
    }
}

/**
 * This function is to get the http request object to call 3rd party APIs
 * @param {*} path 
 * @returns http options object
 */
var getOptionsObject = function (path) {
    try {
        return options = {
            host: "jsonplaceholder.typicode.com",
            path: path,
            method: 'GET'
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    httpRequest,
    getOptionsObject
}