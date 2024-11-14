"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const handleError = (error) => {
    /* Si ocurre un error no controlado de mongo*/
    const mongooseError = error;
    if (mongooseError.name)
        throw new _1.ErrorResponse(500, "SERVER_ERROR");
    /* Si un ocurre un error controlado */
    const { errorType, code } = error;
    throw new _1.ErrorResponse(code, errorType);
};
exports.default = handleError;
