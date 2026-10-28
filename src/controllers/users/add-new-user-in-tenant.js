module.exports = function makeCreateUserAction({
    createUser,
}) {
    return async function createUserAction({ httpRequest }) {
        return createUser({
            body: httpRequest.body,
            linkname: httpRequest.tenant.linkname,
            requesterId: httpRequest.auth.userId,
        });
    };
};
