module.exports = function makeDeleteUserAction({
    deleteUser,
}) {
    return async function deleteUserAction({ httpRequest }) {
        return deleteUser({
            id: httpRequest.params.id,
            linkname: httpRequest.tenant.linkname,
            requesterId: httpRequest.auth.userId,
        });
    };
};