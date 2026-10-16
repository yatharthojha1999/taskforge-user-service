module.exports = function makeCreateUser({ Joi, usersDb, createUserCredentials, tenantsDb }) {
    return async function createUser({
        domain, name, email, status = 'pending', is_super_admin = false, address, zipcode, city, state, country, password
    }) {
        console.log('create user usecase called', {
            domain, name, email, status, is_super_admin, address, zipcode, city, state, country
        });

        try {
            // validatin userInput
            validateInput({
                domain, name, email, status, is_super_admin, address, zipcode, city, state, country, password
            });

            // check if tenant already exist or not
            const tenantDetails = await usersDb.getTenentByDomain({ domain });
            let tenantAndUserDetails;
            if (!tenantDetails) {
                tenantAndUserDetails = await usersDb.createTenantAndUser({
                    domain, name, email, status, is_super_admin, address, zipcode, city, state, country
                });
            } else {
                throw new Error('Tenant with same name already exist!');
            }

            // internal api call to pass data into auth service for storing credentials.
            const apiData = await createUserCredentials({
                linkname: domain,
                userId: tenantAndUserDetails.user.id,
                password,
            });

            if (apiData && apiData.id) {
                // updating status for users and tenant tables.
                await usersDb.updateUserStatus({ status: 'completed', id: tenantAndUserDetails.user.id });
                await tenantsDb.updateTenantStatus({ status, id: tenantAndUserDetails.tenant.id })
            }

            return tenantAndUserDetails;
        } catch (error) {
            console.error("An error occurred:", error.message);
        }
    }

    function validateInput({
        domain, name, email, status, is_super_admin, address, zipcode, city, state, country, password
    }) {
        const schema = Joi.object({
            domain: Joi.string().trim().required(),
            name: Joi.string().trim().required(),
            email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            status: Joi.string().trim().required(),
            is_super_admin: Joi.boolean().required(),
            address: Joi.string().trim().optional().allow(null, ''),
            zipcode: Joi.string().trim().optional().allow(null, ''),
            city: Joi.string().trim().optional().allow(null, ''),
            state: Joi.string().trim().optional().allow(null, ''),
            country: Joi.string().trim().optional().allow(null, ''),
            password: Joi.string().trim().min(8).required(),
        });
        const { error } = schema.validate({
            domain, name, email, status, is_super_admin, address, zipcode, city, state, country, password
        });
        if (error) {
            throw new Error(error.message);
        }
    }
}