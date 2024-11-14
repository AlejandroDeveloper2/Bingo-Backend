"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingoService = exports.AuthService = void 0;
var auth_service_1 = require("./auth.service");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return __importDefault(auth_service_1).default; } });
var bingo_service_1 = require("./bingo.service");
Object.defineProperty(exports, "BingoService", { enumerable: true, get: function () { return __importDefault(bingo_service_1).default; } });
