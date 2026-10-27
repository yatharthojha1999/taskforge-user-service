
module.exports = function makeUpdateUser({ Joi, usersDb }) {
    return async function updateUser({
        id,
        linkname,
        updatedBy,
        body,
    }) {
        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255),
            address: Joi.string().trim().max(255).allow(null, ""),
            zipcode: Joi.string().trim().max(20).allow(null, ""),
            city: Joi.string().trim().max(50).allow(null, ""),
            state: Joi.string().trim().max(50).allow(null, ""),
            country: Joi.string().trim().max(50).allow(null, ""),
        }).min(1).unknown(false);

        const { error, value } = schema.validate(body);

        if (error) {
            const validationError = new Error(error.message);
            validationError.statusCode = 400;
            throw validationError;
        }

        const idSchema = Joi.string().pattern(/^[1-9]\d*$/).required();
        const idValidation = idSchema.validate(id);

        if (idValidation.error) {
            const validationError = new Error("Invalid user ID");
            validationError.statusCode = 400;
            throw validationError;
        }

        const user = await usersDb.updateUser({
            id,
            linkname,
            updatedBy,
            ...value,
        });

        if (!user) {
            const notFoundError = new Error("User not found");
            notFoundError.statusCode = 404;
            throw notFoundError;
        }

        return user;
    };
};
