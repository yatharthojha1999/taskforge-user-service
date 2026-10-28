module.exports = function makeAddNewUserInTenant({
    Joi,
    usersDb,
    sendNewUserInvitation,
}) {
    return async function addNewUserInTenant({
        body,
        linkname,
        requesterId,
    }) {
        // Only the super admin can create tenant-level users
        // until a separate tenant-admin permission model exists.
        if (String(requesterId) !== "1") {
            const error = new Error(
                "Only the super admin can create users"
            );
            error.statusCode = 403;
            throw error;
        }

        const schema = Joi.object({
            name: Joi.string().trim().min(1).max(255).required(),
            email: Joi.string().trim().email().max(255).required(),
            address: Joi.string().allow(null, "").max(255).optional(),
            zipcode: Joi.string().allow(null, "").max(20).optional(),
            city: Joi.string().allow(null, "").max(50).optional(),
            state: Joi.string().allow(null, "").max(50).optional(),
            country: Joi.string().allow(null, "").max(50).optional(),
        }).unknown(false);

        const { error: validationError, value } =
            schema.validate(body, {
                abortEarly: false,
                convert: true,
            });

        if (validationError) {
            const error = new Error(
                validationError.details
                    .map((detail) => detail.message)
                    .join(", ")
            );
            error.statusCode = 400;
            throw error;
        }

        let user;

        try {
            user = await usersDb.createUser({
                ...value,
                linkname,
                createdBy: requesterId,
            });
        } catch (dbError) {
            if (dbError.code === "23505") {
                const error = new Error(
                    "A user with this email already exists"
                );
                error.statusCode = 409;
                throw error;
            }

            throw dbError;
        }

        try {
            await sendNewUserInvitation({
                userId: String(user.id),
                linkname: user.linkname,
                name: user.name,
                email: user.email,
            });
        } catch (invitationError) {
            // The profile exists, but the invitation could not
            // be completed. Keep it pending for safe retry/recovery.
            console.error(
                "Invitation creation failed for user:",
                user.id,
                invitationError.message
            );

            const error = new Error(
                "User was created, but the invitation could not be sent"
            );
            error.statusCode = 502;
            error.userId = String(user.id);
            throw error;
        }

        return {
            message: "User created and invitation sent successfully",
            user,
        };
    };
};
