
const express = require("express");
const {
    healthCheck,
    users,
} = require("./controllers");

const router = express.Router();

// health check routes
router.get("/health", healthCheck.checkServerHealtAction);

//users routes
router.post("/v1/tenants/register", users.createUserAction);
router.get("/internal/v1/tenants/:linkname/users/by-email/:email", users.getUserByLinknameAndEmailAction);

module.exports = router;