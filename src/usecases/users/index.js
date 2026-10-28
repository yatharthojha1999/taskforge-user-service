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

const makeGetUserById = require("./get-user-by-id");
const getUserById = makeGetUserById({
    Joi,
    usersDb,
});

const makeUpdateUser = require("./update-user");
const updateUser = makeUpdateUser({
    Joi,
    usersDb,
});

const makeDeleteUser = require("./delete-user");
const deleteUser = makeDeleteUser({
    Joi,
    usersDb,
});

const makeAddNewUserInTenant = require("./add-new-user-in-tenant");
const addNewUserInTenant = makeAddNewUserInTenant({
    Joi,
    usersDb,
    sendNewUserInvitation: authService.newUserInvitation,
});

module.exports = {
    createUser,
    getUserByLinknameAndEmail,
    validateLink,
    getUserById,
    updateUser,
    deleteUser,
    addNewUserInTenant,
}