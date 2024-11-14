"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const index_1 = require("@controllers/index");
const userSession_middleware_1 = require("@middleware/userSession.middleware");
const router = (0, express_1.Router)();
exports.router = router;
const { postUserAccount, postLoginUser, patchUserSessionStatus, postAuthToken, getUser, } = new index_1.AuthController();
router
    .post("/register", postUserAccount)
    .post("/login", postLoginUser)
    .patch("/sessionStatus/:userId", userSession_middleware_1.checkJwt, patchUserSessionStatus)
    .post("/verifySession", postAuthToken)
    .get("/:userEmail", userSession_middleware_1.checkJwt, getUser);
