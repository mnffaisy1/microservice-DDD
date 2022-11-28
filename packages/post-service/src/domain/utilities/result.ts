import { ErrorCode } from "../ports/response";

export class Result<T> {
  public success: boolean;
  public message: string | undefined;
  public errorCode: ErrorCode | undefined;

  private data: T | undefined;

  public constructor(
    success: boolean,
    message?: string,
    value?: T,
    errorCode?: ErrorCode
  ) {
    this.success = success;
    this.data = value;
    this.errorCode = errorCode;
    this.message = message;

    Object.freeze(this);
  }

  public getValue(): T {
    return <T>this.data;
  }

  public static ok<U>(value: U, message?: string): Result<U> {
    return new Result<U>(true, message, value, undefined);
  }

  public static fail<U>(message: string, errorCode: ErrorCode): Result<U> {
    return new Result<U>(
      false,
      message,
      undefined,
      errorCode || "INTERNAL_SERVER_ERROR"
    );
  }

  public static combine(results: Result<any>[]): Result<any> {
    const resultValues = [];

    for (const result of results) {
      if (!result.success) {
        return result;
      }
      resultValues.push(result.getValue());
    }
    return Result.ok<any>(resultValues);
  }
}
