"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_model_1 = require("./user.model");
const PlayerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    correctBallSelections: {
        type: Number,
        required: true,
    },
}, {
    timestamps: false,
    versionKey: false,
});
const BingoBallSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        enum: ["B", "I", "N", "G", "O"],
    },
    number: {
        type: Number,
        required: true,
    },
    selected: {
        type: Boolean,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: false,
    versionKey: false,
});
const BingoCardSchema = new mongoose_1.Schema({
    balls: {
        type: [BingoBallSchema],
        required: true,
    },
    user: { type: user_model_1.UserSchema, required: true },
    code: {
        type: String,
        required: true,
    },
}, {
    timestamps: false,
    versionKey: false,
});
const GameSchema = new mongoose_1.Schema({
    players: { type: [PlayerSchema], required: true },
    winner: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", default: null },
    bingoCards: {
        type: [BingoCardSchema],
        required: true,
    },
    launchedBallsHistory: {
        type: [BingoBallSchema],
        required: true,
    },
    gameMode: {
        type: String,
        required: true,
        enum: ["full", "diagonal", "vertical", "horizontal", "corners"],
    },
    gameStatus: {
        type: String,
        required: true,
        enum: ["ended", "in-progress", "waiting", "unstart"],
    },
}, {
    timestamps: true,
    versionKey: false,
});
const GameModel = (0, mongoose_1.model)("games", GameSchema);
exports.default = GameModel;
