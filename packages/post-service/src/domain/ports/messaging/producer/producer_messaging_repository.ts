import { IntegrationEventRecord } from "../integration_event_record";
import { ProducerOptions } from "./producer_options";

export interface IDomainProducerMessagingRepository {
  connect(): Promise<void>;
  publish(
    topic: string,
    request: IntegrationEventRecord,
    options?: ProducerOptions
  ): Promise<void>;
  register(schemaObject: any): Promise<number>;
  ping(): Promise<boolean>;
  disconnect(): Promise<void>;
}
