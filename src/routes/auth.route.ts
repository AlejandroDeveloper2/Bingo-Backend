import { Router } from "express";

import { AuthController } from "@controllers/index";
import { checkJwt } from "@middleware/userSession.middleware";

const router = Router();

const { postUserAccount, postLoginUser, patchUserSessionStatus } =
  new AuthController();

router
  .post("/register", postUserAccount)
  .post("/login", postLoginUser)
  .patch("/sessionStatus/:userId", checkJwt, patchUserSessionStatus);

export { router };
