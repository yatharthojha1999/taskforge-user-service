const fs = require("node:fs");
const jwt = require("jsonwebtoken");
const { getAuthConfig } = require("../config/backend_config");
const {usersDb} = require("../database/queries")

function verifyAccessToken(token) {
    const config = getAuthConfig();

    const publicKey = fs.readFileSync(
        config.publicKeyPath,
        "utf8"
    );

    const payload = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
        issuer: config.issuer,
        audience: config.audience,
    });

    if (typeof payload === "string" || typeof payload.sub !== "string" || typeof payload.linkname !== "string") {
        const error = new Error("Invalid access token payload");
        error.code = "INVALID_TOKEN";
        throw error;
    }

    // check if user exist or not helps in checking if user id deleted and api is called by that user.
    const userDetails = await usersDb.getUserById({ id: payload.sub, linkname: payload.linkname });
    if (!(userDetails && userDetails.status === 'completed')) {
         const error = new Error("User not found");
        error.code = "INVALID_USER";
        throw error;
    }

    return {
        userId: payload.sub,
        linkname: payload.linkname,
    };
}

module.exports = verifyAccessToken;
