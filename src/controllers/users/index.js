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

const makeUpdateUserAction = require("./update-user");
const updateUserAction = makeUpdateUserAction({
    updateUserUsecase: usersUsecase.updateUser,
});

const makeDeleteUserAction = require("./delete-user");
const deleteUserAction = makeDeleteUserAction({
    deleteUser: usersUsecase.deleteUser,
});

module.exports = {
    createUserAction,
    getUserByLinknameAndEmailAction,
    validateLinkAction,
    getUserByIdAction,
    updateUserAction,
    deleteUserAction,
}