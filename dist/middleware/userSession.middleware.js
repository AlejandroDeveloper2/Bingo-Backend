"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const index_1 = require("@utils/index");
const checkJwt = (req, res, next) => {
    const jwtToken = new index_1.JwtToken(req.body.email);
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser === null || jwtByUser === void 0 ? void 0 : jwtByUser.split(" ").pop();
        const isUser = jwtToken.verifySessionToken(`${jwt}`);
        if (!isUser) {
            (0, index_1.handleHttpResponse)(res, {
                data: null,
                message: "¡Token de sesión invalido!",
                code: 401,
            }, 401);
        }
        else {
            req.user = isUser;
            next();
        }
    }
    catch (e) {
        (0, index_1.handleHttpResponse)(res, {
            data: null,
            message: "¡Sesión invalida!",
            code: 400,
        }, 400);
    }
};
exports.checkJwt = checkJwt;
