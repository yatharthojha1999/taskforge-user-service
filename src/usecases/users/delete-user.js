
module.exports = function makeDeleteUser({ Joi, usersDb }) {
    return async function deleteUser({
        id,
        linkname,
        requesterId,
    }) {
        // Only the authenticated super admin can delete users.
        if (String(requesterId) !== "1") {
            const error = new Error(
                "Only the super admin can delete users"
            );
            error.statusCode = 403;
            throw error;
        }

        const { error: validationError } = Joi.string()
            .pattern(/^[1-9]\d*$/)
            .required()
            .validate(id);

        if (validationError) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        if (String(id) === "1") {
            const error = new Error(
                "The super admin account cannot be deleted"
            );
            error.statusCode = 403;
            throw error;
        }

        const deletedUser = await usersDb.deleteUser({
            id,
            linkname,
        });

        if (!deletedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        return {
            message: "User deleted successfully",
            user: deletedUser,
        };
    };
};
