module.exports = function makeValidateLink({ Joi, tenantsDb }) {
    return async function validateLink({
        linkname
    }) {
        console.log('validateLink usecase called', { linkname });

        try {
            // validatin userInput
            validateInput({ linkname });

            // get tenant with linkname and email.
            const tenantDetails = await tenantsDb.getTenentByDomain({ domain: linkname });
            if (tenantDetails && tenantDetails.is_active) {
                return tenantDetails;
            } else {
                throw new Error("Tenant do not exist!");
            }
        } catch (error) {
            console.error("An error occurred at validateLink usecase:", error.message);
        }
    }

    function validateInput({
        linkname
    }) {
        const schema = Joi.object({
            linkname: Joi.string().trim().required(),
        });
        const { error } = schema.validate({
            linkname
        });
        if (error) {
            throw new Error(error.message);
        }
    }
}