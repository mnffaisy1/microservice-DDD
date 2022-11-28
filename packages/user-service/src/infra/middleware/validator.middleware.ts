import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

import { TYPES } from "../../application/constants/types";
import { Result } from "../../domain/utilities/result";
import { container } from "../../inversify.config";
import { Logger } from "../logging/pino";

export const validationMiddleware = (dtoClass: any) => {
  const logger = container.get<Logger>(TYPES.Logger).get();

  return function (req: Request, res: Response, next: NextFunction) {
    const output: any = plainToInstance(dtoClass, req.body);
    validate(output).then((errors) => {
      // errors is and array of validation errors
      if (errors.length > 0) {
        logger.info(`Validation Errors: ${errors}`);
        let errorTexts = [];
        for (const errorItem of errors) {
          errorTexts = errorTexts.concat(errorItem.constraints);
        }
        // Result.fail(errorTexts[0], "INVALID_REQUEST");
        res
          .status(400)
          .send(
            Result.fail(
              String(Object.values(errorTexts[0])[0]),
              "INVALID_REQUEST"
            )
          );
        return;
      } else {
        res.locals.input = output;
        next();
      }
    });
  };
};
