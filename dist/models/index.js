"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModel = exports.UserModel = void 0;
var user_model_1 = require("./user.model");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return __importDefault(user_model_1).default; } });
var game_model_1 = require("./game.model");
Object.defineProperty(exports, "GameModel", { enumerable: true, get: function () { return __importDefault(game_model_1).default; } });
