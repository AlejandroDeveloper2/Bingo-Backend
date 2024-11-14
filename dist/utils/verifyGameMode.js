"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCornersMode = exports.verifyHorizontalMode = exports.verifyVerticalMode = exports.verifyDiagonalMode = void 0;
const verifyDiagonalMode = (ballName, ballIndex) => {
    const diagonal = ballName === "B"
        ? ballIndex === 4
        : ballName === "I"
            ? ballIndex === 3
            : ballName === "N"
                ? false
                : ballName === "G"
                    ? ballIndex === 1
                    : ballIndex === 0;
    return diagonal;
};
exports.verifyDiagonalMode = verifyDiagonalMode;
const verifyVerticalMode = (ballName) => {
    const vertical = ballName === "G";
    return vertical;
};
exports.verifyVerticalMode = verifyVerticalMode;
const verifyHorizontalMode = (ballName, ballIndex) => {
    const horizontal = ballName === "N" ? ballIndex === 2 : ballIndex === 3;
    return horizontal;
};
exports.verifyHorizontalMode = verifyHorizontalMode;
const verifyCornersMode = (ballName, ballIndex) => {
    const corners = ballName === "B" || ballName === "O"
        ? ballIndex === 0 || ballIndex === 4
        : false;
    return corners;
};
exports.verifyCornersMode = verifyCornersMode;
