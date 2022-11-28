import { ErrorCode } from "../../domain/ports/response";

export type ErrorData = {
  message: string;
  status?: number;
  errorCode?: ErrorCode;
};

export class CustomError extends Error {
  public status: number;
  public errorCode: ErrorCode;

  constructor(data: ErrorData) {
    super(data.message);
    this.status = data.status;
    this.errorCode = data.errorCode;
  }
}
