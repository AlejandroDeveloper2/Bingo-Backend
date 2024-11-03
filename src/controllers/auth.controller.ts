import { Request, Response } from "express";

import {
  User,
  UserAuth,
  UserSession,
  UserSessionStatus,
} from "@interfaces/index";

import { AuthService } from "@services/index";
import { ErrorResponse, handleHttpResponse } from "@utils/index";
import { JwtPayload } from "jsonwebtoken";

const {
  createUserAccount,
  loginUser,
  updateUserSessionStatus,
  verifyAuthToken,
  getUserProfile,
} = new AuthService();

/* Clase controlador para manejar todas las funciones de autentificación del usuario en el sistema  */
class AuthController {
  constructor() {}

  /* Metodo para crear cuenta de usuario en el sistema */
  public postUserAccount = async (
    { body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user: User = body;
      const newUser: User = await createUserAccount(user);
      handleHttpResponse<User>(
        res,
        {
          data: newUser,
          message:
            "¡Cuenta creada con exito!, Inicia sesión haciendo click en el enlace de abajo.",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { errorType, code } = e as ErrorResponse;
      const message: string =
        errorType === "RECORD_ALREADY"
          ? "¡Ya existe un usuario con ese correo!"
          : "¡Hubo un error al crear la cuenta de usuario";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };

  /* Metodo para iniciar sesión en el sistema con email y contraseña */
  public postLoginUser = async (
    { body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userCredentials: UserAuth = body;
      const userSession: UserSession = await loginUser(userCredentials);
      handleHttpResponse<UserSession>(
        res,
        {
          data: userSession,
          message: "¡Login correcto!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { errorType, code } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡No existe un usuario con ese correo!, por favor verifica."
          : errorType === "INCORRECT_PASSWORD"
          ? "¡Contraseña incorrecta!, intenta de nuevo."
          : "¡Hubo un error al intentar iniciar sesión";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };
  /* Metodo para actualizar el estado de la sesión del usuario logeado */
  public patchUserSessionStatus = async (
    { body, params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId: string = params.userId;
      const userSessionStatus: UserSessionStatus = body;

      const updatedSession: UserSessionStatus = await updateUserSessionStatus(
        userId,
        userSessionStatus
      );

      handleHttpResponse<UserSessionStatus>(
        res,
        {
          data: updatedSession,
          message: "¡Estado de sesión actualizado!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { errorType, code } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id de usuario incorrecto!, Por favor verifique. "
          : "¡Hubo un error al actualizar el estado de la sesión del usuario!";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };

  public postAuthToken = ({ body }: Request, res: Response): void => {
    const userAuth: { token: string } = body;
    try {
      const tokenPayload = verifyAuthToken(userAuth.token);
      handleHttpResponse<JwtPayload>(
        res,
        {
          data: tokenPayload,
          message: "¡Token valido!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { errorType, code } = e as ErrorResponse;
      const message: string =
        errorType === "EXPIRED_TOKEN"
          ? "¡El token ha expirado!"
          : errorType === "INVALID_TOKEN"
          ? "¡Token invalido!"
          : "¡Hubo un error al verificar la sesión del usuario!";
      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };

  public getUser = async (
    { params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userEmail: string = params.userEmail;

      const userProfile: Omit<User, "password"> = await getUserProfile(
        userEmail
      );

      handleHttpResponse<Omit<User, "password">>(
        res,
        {
          data: userProfile,
          message: "¡Perfil Obtenido!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { errorType, code } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id de usuario incorrecto!, Por favor verifique. "
          : "¡Hubo un error al obtener el perfil del usuario!";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };
}

export default AuthController;
