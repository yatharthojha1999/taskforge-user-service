module.exports = function makeGetUserByLinknameAndEmail({ Joi, usersDb }) {
    return async function getUserByLinknameAndEmail({
        domain, email
    }) {
        console.log('getUserByLinknameAndEmail usecase called', {
            domain, email
        });

        try {
            // validatin userInput
            validateInput({
                domain, email
            });

            // get tenant with linkname and email.
            return await usersDb.getUserByDomain({ domain, email });
        } catch (error) {
            console.error("An error occurred at getUserByLinknameAndEmail usecase:", error.message);
        }
    }

    function validateInput({
        domain, email
    }) {
        const schema = Joi.object({
            domain: Joi.string().trim().required(),
            email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        });
        const { error } = schema.validate({
            domain, email
        });
        if (error) {
            throw new Error(error.message);
        }
    }
}