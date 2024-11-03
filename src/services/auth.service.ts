import jwt, { JwtPayload } from "jsonwebtoken";
import {
  User,
  UserAuth,
  UserSession,
  UserSessionStatus,
} from "@interfaces/index";

import { UserModel } from "@models/index";

import { ErrorResponse, Bcrypt, JwtToken, handleError } from "@utils/index";

/* Clase servicio que se comunica con la db
para gestionar todas las funciones de autentificación 
del usuario en el sistema  */

class AuthService {
  constructor() {}

  /* Metodo para registrar un usuario en la base de datos */
  public createUserAccount = async (userData: User): Promise<User> => {
    const bcrypt = new Bcrypt(userData.password, 8);
    try {
      const user = await UserModel.findOne({
        email: userData.email,
      });

      if (user) throw new ErrorResponse(400, "RECORD_ALREADY");

      const encryptedPassword: string = await bcrypt.encryptPassword();

      const newUser: User = await UserModel.create({
        ...userData,
        password: encryptedPassword,
      });

      return newUser;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  /* Metodo para verificar un usuario en la base de datos e iniciar sesión en el sistema */
  public loginUser = async (
    userCredentials: UserAuth
  ): Promise<UserSession> => {
    const bcrypt = new Bcrypt(userCredentials.password, 8);
    const jwt = new JwtToken(userCredentials.email);
    try {
      const user: User | null = await UserModel.findOne({
        email: userCredentials.email,
      });

      if (!user) throw new ErrorResponse(404, "NOT_FOUND");

      const encryptedPassword: string = user.password;
      const isPasswordCorrect: boolean = await bcrypt.verifyEncryptedPass(
        encryptedPassword
      );
      if (!isPasswordCorrect)
        throw new ErrorResponse(403, "INCORRECT_PASSWORD");

      const sessionToken: string = jwt.generateSessionToken();

      return {
        sessionToken,
      };
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  /* Metodo para actualizar el estado de la sesión del usuario logeado en la db */
  public updateUserSessionStatus = async (
    userId: string,
    { sessionStatus }: UserSessionStatus
  ): Promise<UserSessionStatus> => {
    try {
      const updatedSession: UserSessionStatus | null =
        await UserModel.findOneAndUpdate(
          { _id: userId },
          { sessionStatus },
          { new: true }
        ).select("sessionStatus");

      if (!updatedSession) throw new ErrorResponse(404, "NOT_FOUND");
      return updatedSession;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public verifyAuthToken = (token: string): JwtPayload => {
    try {
      const decoded = jwt.verify(
        token,
        <string>process.env.JWT_SECRET
      ) as JwtPayload;
      return decoded;
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError)
        throw new ErrorResponse(403, "EXPIRED_TOKEN");
      else if (error instanceof jwt.JsonWebTokenError)
        throw new ErrorResponse(400, "INVALID_TOKEN");
      else throw new ErrorResponse(500, "SERVER_ERROR");
    }
  };

  public getUserProfile = async (
    userEmail: string
  ): Promise<Omit<User, "password">> => {
    try {
      const userProfile: Omit<User, "password"> | null =
        await UserModel.findOne({ email: userEmail });

      if (!userProfile) throw new ErrorResponse(404, "NOT_FOUND");
      return userProfile;
    } catch (e: unknown) {
      return handleError(e);
    }
  };
}

export default AuthService;
