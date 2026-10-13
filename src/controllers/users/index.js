const usersUsecase = require('../../usecases/users');

const makeCreateUserAction = require('./create-user');
const createUserAction = makeCreateUserAction({
    createUserUsecase: usersUsecase.createUser,
});

module.exports = {
    createUserAction,
}