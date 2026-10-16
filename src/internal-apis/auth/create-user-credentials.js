module.exports = function makeCreateUserCredentials({ axios, authService }) {
    return async function createUserCredentials({
        linkname,
        userId,
        password,
    }) {
        console.log("Creating credentials through Auth Service", {
            linkname,
            userId,
        });

        const authServiceClient = axios.create({
            baseURL: authService,
            timeout: 5000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await authServiceClient.post(
            "/internal/v1/credentials",
            {
                linkname,
                userId,
                password,
            }
        );

        return response.data;
    };
};