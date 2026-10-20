const fs = require("node:fs");
const jwt = require("jsonwebtoken");
const { getAuthConfig } = require("../config/backend_config");

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

    return {
        userId: payload.sub,
        linkname: payload.linkname,
    };
}

module.exports = verifyAccessToken;
