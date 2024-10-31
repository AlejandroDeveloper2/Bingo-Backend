import { Response } from "express";

import { ServerResponse } from "@interfaces/index";

const handleHttpResponse = <T>(
  res: Response,
  serverResponse: ServerResponse<T>,
  code: number
): void => {
  res.status(code);
  res.send(serverResponse);
};

export default handleHttpResponse;
