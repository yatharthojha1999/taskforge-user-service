const Joi = require('joi');
const { usersDb } = require('../../database/queries');

const makeCreateUser = require('./create-user');
const createUser = makeCreateUser({
    Joi,
    usersDb,
});

module.exports = {
    createUser,
}