import { ErrorType } from "@interfaces/index";

export default class ErrorResponse {
  code: number;
  errorType: ErrorType;

  constructor(code: number, errorType: ErrorType) {
    this.code = code;
    this.errorType = errorType;
  }
}
