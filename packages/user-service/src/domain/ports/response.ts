type RESOURCE_DOES_NOT_EXIST_ERROR = "RESOURCE_DOES_NOT_EXIST";
type INVALID_REQUEST_ERROR = "INVALID_REQUEST";
type CONFLICT = "RESOURCE_ALREADY_EXIST";
type UNKNOWN_ERROR = "UNKNOWN_ERROR";
type INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

export type ErrorCode =
  | RESOURCE_DOES_NOT_EXIST_ERROR
  | INVALID_REQUEST_ERROR
  | CONFLICT
  | UNKNOWN_ERROR
  | INTERNAL_SERVER_ERROR;

export interface IResponseBase {
  success: boolean;
  message: string;
  errorCode?: ErrorCode;
}

export interface IResponse<T> extends IResponseBase {
  data?: T;
}
