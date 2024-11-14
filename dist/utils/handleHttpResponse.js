"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleHttpResponse = (res, serverResponse, code) => {
    res.status(code);
    res.send(serverResponse);
};
exports.default = handleHttpResponse;
