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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("@models/index");
const index_2 = require("@utils/index");
/* Clase servicio que se comunica con la db
para gestionar todas las funciones de autentificación
del usuario en el sistema  */
class AuthService {
    constructor() {
        /* Metodo para registrar un usuario en la base de datos */
        this.createUserAccount = (userData) => __awaiter(this, void 0, void 0, function* () {
            const bcrypt = new index_2.Bcrypt(userData.password, 8);
            try {
                const user = yield index_1.UserModel.findOne({
                    email: userData.email,
                });
                if (user)
                    throw new index_2.ErrorResponse(400, "RECORD_ALREADY");
                const encryptedPassword = yield bcrypt.encryptPassword();
                const newUser = yield index_1.UserModel.create(Object.assign(Object.assign({}, userData), { password: encryptedPassword }));
                return newUser;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        /* Metodo para verificar un usuario en la base de datos e iniciar sesión en el sistema */
        this.loginUser = (userCredentials) => __awaiter(this, void 0, void 0, function* () {
            const bcrypt = new index_2.Bcrypt(userCredentials.password, 8);
            const jwt = new index_2.JwtToken(userCredentials.email);
            try {
                const user = yield index_1.UserModel.findOne({
                    email: userCredentials.email,
                });
                if (!user)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                const encryptedPassword = user.password;
                const isPasswordCorrect = yield bcrypt.verifyEncryptedPass(encryptedPassword);
                if (!isPasswordCorrect)
                    throw new index_2.ErrorResponse(403, "INCORRECT_PASSWORD");
                const sessionToken = jwt.generateSessionToken();
                return {
                    sessionToken,
                };
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        /* Metodo para actualizar el estado de la sesión del usuario logeado en la db */
        this.updateUserSessionStatus = (userId_1, _a) => __awaiter(this, [userId_1, _a], void 0, function* (userId, { sessionStatus }) {
            try {
                const updatedSession = yield index_1.UserModel.findOneAndUpdate({ _id: userId }, { sessionStatus }, { new: true }).select("sessionStatus");
                if (!updatedSession)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return updatedSession;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.verifyAuthToken = (token) => {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                return decoded;
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.default.TokenExpiredError)
                    throw new index_2.ErrorResponse(403, "EXPIRED_TOKEN");
                else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError)
                    throw new index_2.ErrorResponse(400, "INVALID_TOKEN");
                else
                    throw new index_2.ErrorResponse(500, "SERVER_ERROR");
            }
        };
        this.getUserProfile = (userEmail) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = yield index_1.UserModel.findOne({ email: userEmail });
                if (!userProfile)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return userProfile;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
    }
}
exports.default = AuthService;
