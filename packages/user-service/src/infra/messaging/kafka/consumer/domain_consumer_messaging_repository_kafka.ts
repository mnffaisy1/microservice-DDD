import { Consumer, EachMessagePayload, Kafka, logLevel } from "kafkajs";

import {
  ConsumerOptions,
  DefaultConsumerOptions,
  IDomainConsumerMessagingRepository,
  SubscriptionParameters
} from "../../../../domain/ports/messaging/consumer";
import { InboxMessage } from "../../../../domain/ports/messaging/consumer/consumer_messaging_repository";
import { IEventQueue } from "../../../../domain/ports/messaging/consumer/event_queue";
import { KafkaConfiguration } from "../configuration";

export class DomainConsumerMessagingRepositoryKafka implements IDomainConsumerMessagingRepository
{
  private _kafkaClient: Kafka;
  private _consumer!: Consumer;

  private _kafkaConfiguration: KafkaConfiguration;

  constructor(kafkaConfiguration: KafkaConfiguration) {
    this._kafkaConfiguration = kafkaConfiguration;
    this._kafkaClient = new Kafka({
      clientId: "UserService",
      connectionTimeout: kafkaConfiguration.KAFKA_CONNECTION_TIMEOUT,
      brokers: kafkaConfiguration.KAFKA_BROKERS,
      logLevel: logLevel.INFO
    });
  }

  async subscribe(
    subscriptionParametersList: SubscriptionParameters[],
    consumerOptions?: ConsumerOptions
  ): Promise<boolean | IEventQueue<InboxMessage>> {
    const groupId =
      consumerOptions?.groupId ||
      this._kafkaConfiguration.KAFKA_CONSUMER_GROUP_ID ||
      "userGuid";

    this._consumer = this._kafkaClient.consumer({
      groupId,
      sessionTimeout: consumerOptions?.sessionTimeout,
      maxInFlightRequests: consumerOptions?.maxInFlightRequests,
      retry: consumerOptions?.retry || DefaultConsumerOptions.retry
    });

    const consumer = this._consumer;

    await consumer.connect();

    const topics = subscriptionParametersList
      .map((plist) => plist.topic)
      .filter((v, i, a) => a.indexOf(v) === i);

    const subscriptionPromises: Promise<any>[] = [];

    topics.forEach((topic: string) => {
      let readFromBeginning = false;
      subscriptionParametersList.forEach((plist) => {
        if (plist.topic === topic && plist.readFromBeginning) {
          readFromBeginning = true;
          // log
        }
      });

      subscriptionPromises.push(
        consumer.subscribe({ topic, fromBeginning: readFromBeginning })
      );
    });

    await Promise.all(subscriptionPromises);

    await consumer.run({
      autoCommitInterval:
        consumerOptions?.autoCommitInterval ||
        DefaultConsumerOptions.autoCommitInterval,
      autoCommitThreshold:
        consumerOptions?.autoCommitThreshold ||
        DefaultConsumerOptions.autoCommitThreshold,
      eachMessage: async (payload: EachMessagePayload) => {
        const incomingMessageTopic = payload.topic;

        const subscriptionPromises = subscriptionParametersList.map(
          async (subscriptionParameters) => {
            const noAvroDecoding =
              subscriptionParameters.noAvroDecoding || false;
            const headers = this.parseHeaders(payload);
            const eventType = headers["eventType"] ? headers["eventType"] : "";

            const isSubscribed = this.isHandlerSubscribed(
              subscriptionParameters,
              incomingMessageTopic,
              eventType
            );

            if (isSubscribed) {
              const decodedMessage = await this.decodeMessage(
                noAvroDecoding,
                payload
              );

              await this.enqueueForProcessing(
                decodedMessage,
                subscriptionParameters,
                consumer
              );
            }
          }
        );
        await Promise.all(subscriptionPromises);
      }
    });
    return true;
  }

  private parseHeaders(payload: any) {
    const headers: any = {};
    Object.keys(payload.message.headers).forEach((prop) => {
      // eslint-disable-next-line no-prototype-builtins
      if (payload.message.headers.hasOwnProperty(prop)) {
        headers[prop] = payload.message.headers[prop]
          ? payload.message.headers[prop].toString("utf8")
          : "";
      }
    });
    return headers;
  }

  private async decodeMessage(
    noAvroDecoding: boolean,
    payload: EachMessagePayload
  ) {
    const value = await this.parseBody(noAvroDecoding, payload);

    const decodedMessage: any = {
      key: payload.message.key ? payload.message.key.toString("utf-8") : "",
      value,
      headers: undefined,
      topic: payload.topic
      // partition: payload.partition
    };
    return decodedMessage;
  }

  private async parseBody(
    noAvroDecoding: boolean,
    payload: EachMessagePayload
  ) {
    let value;

    try {
      value = payload.message.value
        ? JSON.parse(payload.message.value.toString("utf-8"))
        : "";
    } catch (err) {
      // log
      value = payload.message.value;
    }
    // }

    return value;
  }

  private async enqueueForProcessing(
    decodedMessage: any,
    subscriptionParameters: SubscriptionParameters,
    consumer: any
  ) {
    const incomingMessageTopic = subscriptionParameters.topic;

    try {
      subscriptionParameters.handles.handle(decodedMessage);
    } catch (err) {
      console.log(err);
    }
  }

  private isHandlerSubscribed(
    subscriptionParameters: SubscriptionParameters,
    incomingMessageTopic: string,
    eventType: string
  ): boolean {
    return (
      incomingMessageTopic === subscriptionParameters.topic &&
      (!subscriptionParameters.eventTypes ||
        subscriptionParameters.eventTypes?.length === 0 ||
        subscriptionParameters.eventTypes?.includes(eventType))
    );
  }

  async disconnect(): Promise<void> {
    // eslint-disable-next-line no-useless-catch
    try {
      await this._consumer.disconnect();
    } catch (err) {
      throw err;
    }
  }
}
