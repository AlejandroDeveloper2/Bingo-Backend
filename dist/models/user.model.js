"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    sessionStatus: {
        type: String,
        default: "offline",
        enum: ["online", "offline"],
    },
}, {
    timestamps: true,
    versionKey: false,
});
const UserModel = (0, mongoose_1.model)("users", exports.UserSchema);
exports.default = UserModel;
