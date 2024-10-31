import { NextFunction, Response } from "express";

import { RequestExt } from "@interfaces/index";

import { handleHttpResponse, JwtToken } from "@utils/index";

const checkJwt = (req: RequestExt, res: Response, next: NextFunction): void => {
  const jwtToken = new JwtToken(req.body.email);

  try {
    const jwtByUser = req.headers.authorization || null;
    const jwt = jwtByUser?.split(" ").pop();
    const isUser = jwtToken.verifySessionToken(`${jwt}`);
    if (!isUser) {
      handleHttpResponse(
        res,
        {
          data: null,
          message: "¡Token de sesión invalido!",
          code: 401,
        },
        401
      );
    } else {
      req.user = isUser;
      next();
    }
  } catch (e: unknown) {
    handleHttpResponse(
      res,
      {
        data: null,
        message: "¡Sesión invalida!",
        code: 400,
      },
      400
    );
  }
};

export { checkJwt };
