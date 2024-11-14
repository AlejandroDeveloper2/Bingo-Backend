"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingoController = exports.AuthController = void 0;
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var bingo_controller_1 = require("./bingo.controller");
Object.defineProperty(exports, "BingoController", { enumerable: true, get: function () { return __importDefault(bingo_controller_1).default; } });
