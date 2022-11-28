import { Response } from "express";
import { inject, injectable } from "inversify";
import { BaseHttpController } from "inversify-express-utils";

import { Result } from "../../../domain/utilities/result";
import { ILogger, Logger } from "../../../infra/logging/pino";
import { TYPES } from "../../constants/types";

@injectable()
export abstract class BaseController extends BaseHttpController {
  protected logger: ILogger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    super();
    this.logger = logger.get();
  }

  protected createResponse<T>(
    response: Response,
    responseModel: Result<T>,
    successStatusCode?: number
  ): void {
    if (responseModel.success) {
      response.status(successStatusCode || 200);
    } else if (
      !responseModel.errorCode ||
      responseModel.errorCode === "INTERNAL_SERVER_ERROR"
    ) {
      response.status(500);
    } else if (responseModel.errorCode === "INVALID_REQUEST") {
      response.status(400);
    } else if (responseModel.errorCode === "RESOURCE_ALREADY_EXIST") {
      response.status(409);
    } else if (responseModel.errorCode === "RESOURCE_DOES_NOT_EXIST") {
      response.status(404);
    }

    response.json(responseModel);
  }
}
