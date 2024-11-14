"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse {
    constructor(code, errorType) {
        this.code = code;
        this.errorType = errorType;
    }
}
exports.default = ErrorResponse;
