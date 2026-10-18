const usersUsecase = require('../../usecases/users');

const makeCreateUserAction = require('./create-user');
const createUserAction = makeCreateUserAction({
    createUserUsecase: usersUsecase.createUser,
});

const makeGetUserByLinknameAndEmailAction = require('./get-user-by-linkname-and-email');
const getUserByLinknameAndEmailAction = makeGetUserByLinknameAndEmailAction({
    getUserByLinknameAndEmailUsecase: usersUsecase.getUserByLinknameAndEmail,
});

module.exports = {
    createUserAction,
    getUserByLinknameAndEmailAction,
}