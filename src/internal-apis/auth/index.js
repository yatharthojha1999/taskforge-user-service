const axios = require('axios');
const { authService } = require('../../config/backend_config');

const makeCreateUserCredentials = require('./create-user-credentials');
const createUserCredentials = makeCreateUserCredentials({
    axios,
    authService,
});

module.exports = {
    createUserCredentials,
}