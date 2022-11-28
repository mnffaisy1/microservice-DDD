import { Container, interfaces } from "inversify";
import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";
import { DataSourceApp, IAppDataSource } from "./infra/typeorm/typeorm.config";
import { UserRepository } from "./infra/repos/users";
import { DomainProducerMessagingRepositoryKafka } from "./infra/messaging/kafka/producer";
import { KafkaConfiguration } from "./infra/messaging/kafka/configuration";
import { AppSettings } from "./settings/app.settings";
import { IDomainProducerMessagingRepository } from "./domain/ports/messaging/producer";
import { IUserRepository } from "./domain/users/user.repo";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container
  .bind<IAppDataSource>(TYPES.DataSource)
  .to(DataSourceApp)
  .inSingletonScope();
container
  .bind<IDomainProducerMessagingRepository>(TYPES.MessagingProducer)
  .toFactory<IDomainProducerMessagingRepository>(
    (context: interfaces.Context) => {
      const producer = new DomainProducerMessagingRepositoryKafka(
        KafkaConfiguration.getKafkaConfiguration({
          KAFKA_BROKERS: [AppSettings.KAFKA_BROKER],
          KAFKA_CONNECTION_TIMEOUT: 5000,
          KAFKA_CERTIFICATE_BASE64: "122"
        })
      );
      producer.connect();
      return () => producer;
    }
  );

export { container };
