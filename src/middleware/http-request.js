function middleware({
    controller,
    byPassAuthCheck = false,
    byPassLinkValidation = false,
    validateLink,
    verifyAccessToken,
}) {
    if (typeof controller !== "function") throw new TypeError("A valid controller is required");

    if (!byPassLinkValidation && typeof validateLink !== "function") throw new TypeError("validateLink is required unless byPassLinkValidation is true");

    return async function (req, res) {
        try {
            let auth = null;
            let linkname;
            let userId;
            if (!byPassAuthCheck) {
                const authorization = req.headers.accesstoken;
                if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required" });
                const token = authorization.slice(7).trim();
                if (!token) return res.status(401).json({ message: "Authentication required" });
                try {
                    auth = verifyAccessToken(token);
                } catch (error) {
                    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.name === "NotBeforeError" || error.code === "INVALID_TOKEN") {
                        return res.status(401).json({ message: "Invalid or expired access token" });
                    }
                    throw error;
                }
                linkname = auth.linkname;
                userId = auth.userId;
            } else {
                linkname = req.headers["x-linkname"];
            }

            // 2. Validate tenant
            if (!byPassLinkValidation) {
                if (typeof linkname !== "string" || !linkname.trim()) return res.status(400).json({ message: "Tenant link is required" });
                linkname = linkname.trim();
                const isValidLink = await validateLink({ linkname });
                if (!isValidLink) return res.status(403).json({ message: "Tenant is invalid or inactive" });
            }

            // 3. Extract request data
            const httpRequest = {
                headers: req.headers,
                params: req.params,
                query: req.query,
                body: req.body ?? {},
                auth,
                tenant: linkname ? { linkname } : null,
            };

            // 4. Call controller
            return await controller({ httpRequest });
        } catch (error) {
            return error;
        }
    };
}

module.exports = middleware;
