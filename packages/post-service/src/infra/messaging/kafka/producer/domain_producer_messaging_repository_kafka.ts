import { injectable } from "inversify";
import { Kafka, logLevel, Partitioners, Producer, Transaction } from "kafkajs";
import { v4 } from "uuid";

import {
  IDomainProducerMessagingRepository,
  IntegrationEventRecord,
  IProducerRequest,
  ProducerOptions
} from "../../../../domain/ports/messaging/producer";
import { KafkaConfiguration } from "../configuration";

@injectable()
export class DomainProducerMessagingRepositoryKafka implements IDomainProducerMessagingRepository {
  private _kafkaClient: Kafka;

  private _kafkaConfiguration: KafkaConfiguration;

  private _producer: Producer;

  constructor(kafkaConfiguration: KafkaConfiguration) {
    this._kafkaConfiguration = kafkaConfiguration;

    this._kafkaClient = new Kafka({
      clientId: "PostService",
      connectionTimeout: kafkaConfiguration.KAFKA_CONNECTION_TIMEOUT,
      brokers: kafkaConfiguration.KAFKA_BROKERS,
      logLevel: logLevel.INFO
    });

    this._producer = this.getNewProducer();
  }

  private getNewProducer() {
    return this._kafkaClient.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionalId: v4(),
      transactionTimeout: this._kafkaConfiguration.KAFKA_TRANSACTION_TIMEOUT
      // createPartitioner: Partitioners.DefaultPartitioner
    });
  }

  async connect(): Promise<void> {
    await this._producer.connect();
  }

  async disconnect(): Promise<void> {
    await this._producer.disconnect();
  }

  async publish(topic: string, event: IntegrationEventRecord, options?: ProducerOptions): Promise<void> {
    const { doNotCarryForwardSourceStampings, noAvroEncoding, doNotOverrideEventSource } = options || {};

    event.dateTimeOccurred = new Date();

    const headers: any = this.setHeaders(event, doNotCarryForwardSourceStampings);

    const request: IProducerRequest = {
      topic: [topic],
      value: JSON.stringify(event.data),
      // partition: 0,
      seconds: 1,
      avroschemaName: event.schema,
      schemaId: event.schemaId,
      header: headers
    };

    let encodedValue: Buffer | null = null;

    try {
      const messages = [
        {
          key: request.key ? request.key.toLowerCase() : request.key,
          value: !noAvroEncoding ? encodedValue : request.value,
          headers
        }
      ];

      if (options?.nonTransactional) {
        await this.produceNonTransactionalMessage(topic, messages);
      } else {
        await this.produceTransactionalMessage(topic, messages, event.eventType);
      }
    } catch (err) {
      const errorMessage = JSON.stringify(err, Object.getOwnPropertyNames(err));
      // Log
      throw err;
    }
  }

  private setHeaders(event: IntegrationEventRecord, doNotCarryForwardSourceStampings: boolean | undefined) {
    const headers: any = {};
    headers["eventType"] = event.eventType;
    return headers;
  }

  private async produceTransactionalMessage(topic: string, messages: any, eventType: string) {
    let transaction: Transaction | undefined;

    try {
      transaction = await this._producer.transaction();
      await transaction.send({
        topic,
        messages
      });
      await transaction.commit();
    } catch (err) {
      if (transaction) await this.abortTransaction(transaction, topic, eventType);
      throw err;
    }
  }

  private async abortTransaction(transaction: Transaction, topic: string, eventType: string) {
    try {
      await transaction.abort();
    } catch (err) {
      // log
      if ((err as { type: string }).type === "INVALID_TXT_STATE") {
        await this.reinitializeProducer(topic, eventType);
      }
    }
  }

  private async produceNonTransactionalMessage(topic: string, messages: any) {
    // log
    await this._producer.send({ topic, messages });
  }

  private async reinitializeProducer(topic: string, eventType: string) {
    await this._producer.disconnect();
    this._producer = this.getNewProducer();
    await this._producer.connect();
  }

  register(schemaObject: any): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async ping(): Promise<boolean> {
    try {
      const admin = this._kafkaClient.admin();
      await admin.connect();
      // this.logger.info("Kafka ping success");
      await admin.disconnect();
    } catch (err) {
      // this.logger.info("Kafka ping failure");

      return false;
    }
    return true;
  }
}
