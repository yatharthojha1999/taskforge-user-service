const usersUsecase = require('../../usecases/users');

const makeCreateUserAction = require('./create-user');
const createUserAction = makeCreateUserAction({
    createUserUsecase: usersUsecase.createUser,
});

const makeGetUserByLinknameAndEmailAction = require('./get-user-by-linkname-and-email');
const getUserByLinknameAndEmailAction = makeGetUserByLinknameAndEmailAction({
    getUserByLinknameAndEmailUsecase: usersUsecase.getUserByLinknameAndEmail,
});

const makeValidateLinkAction = require('./validate-link');
const validateLinkAction = makeValidateLinkAction({
    validateLinkUsecase: usersUsecase.validateLink,
});

const makeGetUserByIdAction = require("./get-user-by-id");
const getUserByIdAction = makeGetUserByIdAction({
    getUserByIdUsecase: usersUsecase.getUserById,
});

module.exports = {
    createUserAction,
    getUserByLinknameAndEmailAction,
    validateLinkAction,
    getUserByIdAction,
}