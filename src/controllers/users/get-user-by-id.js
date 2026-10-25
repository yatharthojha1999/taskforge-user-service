
module.exports = function makeGetUserByIdAction({ getUserByIdUsecase }) {
    return async function getUserByIdAction({ httpRequest }) {
        const id = httpRequest.params.id;
        const linkname = httpRequest.tenant.linkname;

        return await getUserByIdUsecase({
            id,
            linkname,
        });
    };
};
