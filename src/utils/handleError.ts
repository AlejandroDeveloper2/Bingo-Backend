import { MongooseError } from "mongoose";

import { ErrorResponse } from ".";

const handleError = (error: unknown): never => {
  /* Si ocurre un error no controlado de mongo*/
  const mongooseError: MongooseError = error as MongooseError;
  if (mongooseError.name) throw new ErrorResponse(500, "SERVER_ERROR");

  /* Si un ocurre un error controlado */
  const { errorType, code } = error as ErrorResponse;
  throw new ErrorResponse(code, errorType);
};

export default handleError;
