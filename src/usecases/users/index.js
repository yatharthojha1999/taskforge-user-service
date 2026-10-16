const Joi = require('joi');
const { usersDb, tenantsDb } = require('../../database/queries');
const { authService } = require('../../internal-apis');

const makeCreateUser = require('./create-user');
const createUser = makeCreateUser({
    Joi,
    usersDb,
    createUserCredentials: authService.createUserCredentials,
    tenantsDb,
});

module.exports = {
    createUser,
}