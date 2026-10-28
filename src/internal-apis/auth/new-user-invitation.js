module.exports = function makeNewUserInvitation({ axios, authService }) {
    return async function newUserInvitation({
        userId,
        linkname,
        name,
        email,
    }) {
        console.log("newUserInvitation through Auth Service", {
            userId,
            linkname,
        });

        const authServiceClient = axios.create({
            baseURL: authService,
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await authServiceClient.post(
            "/internal/v1/invitations",
            {
                userId,
                linkname,
                name,
                email,
            }
        );

        return response.data;
    };
};
