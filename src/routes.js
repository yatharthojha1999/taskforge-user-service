
const express = require("express");
const {
    healthCheck,
    users,
} = require("./controllers");

const userUsecase = require("./usecases/users");

const router = express.Router();
const middleware = require("../src/middleware/http-request");
const verifyAccessToken = require("./middleware/verify-access-token");

// health check routes
router.get("/health", healthCheck.checkServerHealtAction);

//users routes
router.post("/v1/tenants/register", users.createUserAction);
router.get("/internal/v1/tenants/:linkname/users/by-email/:email", users.getUserByLinknameAndEmailAction);
router.get("/internal/v1/validate-link/:linkname", users.validateLinkAction);

router.get("/v1/users/:id", middleware({
        controller: users.getUserByIdAction,
        validateLink: userUsecase.validateLink,
        verifyAccessToken,
    })
);

module.exports = router;