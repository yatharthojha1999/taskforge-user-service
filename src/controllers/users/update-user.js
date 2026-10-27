
module.exports = function makeUpdateUserAction({ updateUserUsecase }) {
    return async function updateUserAction({ httpRequest }) {
        return updateUserUsecase({
            id: httpRequest.params.id,
            linkname: httpRequest.tenant.linkname,
            updatedBy: httpRequest.auth.userId,
            body: httpRequest.body,
        });
    };
};
