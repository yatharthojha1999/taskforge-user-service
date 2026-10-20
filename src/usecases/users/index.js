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

const makeGetUserByLinknameAndEmail = require('./get-user-by-linkname-and-email');
const getUserByLinknameAndEmail = makeGetUserByLinknameAndEmail({
    Joi,
    usersDb,
});

const makeValidateLink = require('./validate-link');
const validateLink = makeValidateLink({
    Joi,
    tenantsDb,
});

module.exports = {
    createUser,
    getUserByLinknameAndEmail,
    validateLink,
}