const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(token) {
    //Check if no token
    if(!token){
        return {
            status: 401,
            message: 'No token, authorization denied',
            user: null
        };
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        return {
            status: 200,
            message: 'Success',
            user: decoded.user
        };
    } catch (error) {
        return {
            status: 401,
            message: 'Token is not valid',
            user: null
        };
    }
}