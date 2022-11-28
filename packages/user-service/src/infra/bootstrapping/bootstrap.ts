import express from "express";
import { Container, ContainerModule } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { errorMiddleware } from "../middleware/error.middleware";
import { TYPES } from "../../application/constants/types";
import { Logger } from "../logging/pino";

import "../../application/rest_api/controllers/index.controller";
import "../../application/rest_api/controllers/user.controller";
import { IAppDataSource } from "../typeorm/typeorm.config";
import { DomainConsumerMessagingRepositoryKafka } from "../messaging/kafka/consumer";
import { KafkaConfiguration } from "../messaging/kafka/configuration";
import postConsumer from "../../application/consumers/post.consumer";
import { AppSettings } from "../../settings/app.settings";

export async function bootstrap(
  container: Container,
  port: number,
  ...modules: ContainerModule[]
) {
  if (!container.isBound(TYPES.App)) {
    container.load(...modules);
    const logger = container.get<Logger>(TYPES.Logger).get();

    logger.info("Bootstrapping the service");

    const server = new InversifyExpressServer(container, null, {
      rootPath: "/api/v1"
    });

    logger.info("Initializing express server");

    server.setConfig((app) => {
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());
      app.use(cors());
      app.use(morgan("combined"));
      app.use(helmet());
    });

    server.setErrorConfig((app) => {
      app.use(errorMiddleware);
    });

    try {
      const appDataSource = container
        .get<IAppDataSource>(TYPES.DataSource)
        .instance();
      await appDataSource.initialize();

      logger.info("Initialized database");

      const consumer = new DomainConsumerMessagingRepositoryKafka(
        KafkaConfiguration.getKafkaConfiguration({
          KAFKA_BROKERS: [AppSettings.KAFKA_BROKER],
          KAFKA_CONNECTION_TIMEOUT: 5000,
          KAFKA_CERTIFICATE_BASE64: "122"
        })
      );

      consumer.subscribe(postConsumer);

      const app = server.build();
      app.listen(port, () => {
        logger.info(`Service live at http://localhost:${port}/api/v1`);
      });

      container.bind<express.Application>(TYPES.App).toConstantValue(app);
    } catch (error) {
      console.error(error);
    }
  }
  return container.get<express.Application>(TYPES.App);
}
