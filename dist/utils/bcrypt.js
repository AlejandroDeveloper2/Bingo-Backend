"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
class Bcrypt {
    constructor(password, salt) {
        this.password = "";
        this.salt = "";
        this.password = password;
        this.salt = salt;
    }
    encryptPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedPassword = yield (0, bcryptjs_1.hash)(this.password, this.salt);
            return encryptedPassword;
        });
    }
    verifyEncryptedPass(encryptedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCorrect = yield (0, bcryptjs_1.compare)(this.password, encryptedPassword);
            return isCorrect;
        });
    }
}
exports.default = Bcrypt;
