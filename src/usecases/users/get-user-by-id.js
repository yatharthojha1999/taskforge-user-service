
module.exports = function makeGetUserById({
    Joi,
    usersDb,
}) {
    return async function getUserById({
        id,
        linkname,
    }) {
        const schema = Joi.object({
            id: Joi.string().pattern(/^[1-9]\d*$/).required(),
            linkname: Joi.string().trim().required(),
        });

        const { error } = schema.validate({ id, linkname });

        if (error) {
            const validationError = new Error("Invalid user ID or tenant link");
            validationError.statusCode = 400;
            throw validationError;
        }

        const user = await usersDb.getUserById({ id, linkname });

        if (!user) {
            const notFoundError = new Error("User not found");
            notFoundError.statusCode = 404;
            throw notFoundError;
        }

        return user;
    };
};
