import { Response } from "express";
import { controller, httpGet, response } from "inversify-express-utils";
import { Result } from "../../../domain/utilities/result";
import { BaseController } from "../base/base.controller";

@controller("/")
export class AppController extends BaseController {
  @httpGet("/")
  private ping(@response() res: Response) {
    this.logger.info("Ping Pong");

    this.createResponse(
      res,
      Result.ok({
        author: "Mohammad Faisal Kuchay",
        service: "Post Service",
        version: "0.0.1",
        ping: true
      })
    );
  }
}
