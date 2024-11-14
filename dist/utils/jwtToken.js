"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtToken {
    constructor(id) {
        this.jwtSecret = process.env.JWT_SECRET || "token.01010101";
        this.id = "";
        this.id = id;
    }
    generateSessionToken() {
        const jwt = (0, jsonwebtoken_1.sign)({ id: this.id }, this.jwtSecret, {
            expiresIn: "48h",
        });
        return jwt;
    }
    verifySessionToken(jwt) {
        const jwtPayload = (0, jsonwebtoken_1.verify)(jwt, this.jwtSecret);
        return jwtPayload;
    }
}
exports.default = JwtToken;
