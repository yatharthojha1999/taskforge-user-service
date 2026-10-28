const axios = require('axios');
const { authService } = require('../../config/backend_config');

const makeCreateUserCredentials = require('./create-user-credentials');
const createUserCredentials = makeCreateUserCredentials({
    axios,
    authService,
});

const makeNewUserInvitation = require('./new-user-invitation');
const newUserInvitation = makeNewUserInvitation({
    axios,
    authService,
});

module.exports = {
    createUserCredentials,
    newUserInvitation,
}