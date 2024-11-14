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
const index_1 = require("@services/index");
const index_2 = require("@utils/index");
const { createUserAccount, loginUser, updateUserSessionStatus, verifyAuthToken, getUserProfile, } = new index_1.AuthService();
/* Clase controlador para manejar todas las funciones de autentificación del usuario en el sistema  */
class AuthController {
    constructor() {
        /* Metodo para crear cuenta de usuario en el sistema */
        this.postUserAccount = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ body }, res) {
            try {
                const user = body;
                const newUser = yield createUserAccount(user);
                (0, index_2.handleHttpResponse)(res, {
                    data: newUser,
                    message: "¡Cuenta creada con exito!, Inicia sesión haciendo click en el enlace de abajo.",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { errorType, code } = e;
                const message = errorType === "RECORD_ALREADY"
                    ? "¡Ya existe un usuario con ese correo!"
                    : "¡Hubo un error al crear la cuenta de usuario";
                (0, index_2.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        /* Metodo para iniciar sesión en el sistema con email y contraseña */
        this.postLoginUser = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ body }, res) {
            try {
                const userCredentials = body;
                const userSession = yield loginUser(userCredentials);
                (0, index_2.handleHttpResponse)(res, {
                    data: userSession,
                    message: "¡Login correcto!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { errorType, code } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡No existe un usuario con ese correo!, por favor verifica."
                    : errorType === "INCORRECT_PASSWORD"
                        ? "¡Contraseña incorrecta!, intenta de nuevo."
                        : "¡Hubo un error al intentar iniciar sesión";
                (0, index_2.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        /* Metodo para actualizar el estado de la sesión del usuario logeado */
        this.patchUserSessionStatus = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ body, params }, res) {
            try {
                const userId = params.userId;
                const userSessionStatus = body;
                const updatedSession = yield updateUserSessionStatus(userId, userSessionStatus);
                (0, index_2.handleHttpResponse)(res, {
                    data: updatedSession,
                    message: "¡Estado de sesión actualizado!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { errorType, code } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id de usuario incorrecto!, Por favor verifique. "
                    : "¡Hubo un error al actualizar el estado de la sesión del usuario!";
                (0, index_2.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.postAuthToken = ({ body }, res) => {
            const userAuth = body;
            try {
                const tokenPayload = verifyAuthToken(userAuth.token);
                (0, index_2.handleHttpResponse)(res, {
                    data: tokenPayload,
                    message: "¡Token valido!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { errorType, code } = e;
                const message = errorType === "EXPIRED_TOKEN"
                    ? "¡El token ha expirado!"
                    : errorType === "INVALID_TOKEN"
                        ? "¡Token invalido!"
                        : "¡Hubo un error al verificar la sesión del usuario!";
                (0, index_2.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        };
        this.getUser = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params }, res) {
            try {
                const userEmail = params.userEmail;
                const userProfile = yield getUserProfile(userEmail);
                (0, index_2.handleHttpResponse)(res, {
                    data: userProfile,
                    message: "¡Perfil Obtenido!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { errorType, code } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id de usuario incorrecto!, Por favor verifique. "
                    : "¡Hubo un error al obtener el perfil del usuario!";
                (0, index_2.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
    }
}
exports.default = AuthController;
