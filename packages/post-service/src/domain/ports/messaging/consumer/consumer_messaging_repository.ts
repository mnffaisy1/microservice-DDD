import { IntegrationEventRecord } from "../integration_event_record";
import { ConsumerOptions } from "./consumer_options";
import { IEventQueue } from "./event_queue";
import { SubscriptionParameters } from "./subscribe_parameters";

export interface IDomainConsumerMessagingRepository {
  subscribe(
    subscriptionParameters: SubscriptionParameters[],
    consumerOptions?: ConsumerOptions
  ): Promise<IEventQueue<InboxMessage> | boolean>;
  disconnect(): Promise<void>;
}

export interface InboxMessage {
  integrationEventRecord: IntegrationEventRecord;
  handlerName: string;
  topic: string;
  metadata: any;
}
