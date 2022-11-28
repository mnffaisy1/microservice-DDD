import { IIntegrationEventHandler } from "./integration_event_handler";

export interface SubscriptionParameters {
  eventTypes?: string[];
  topic: string;
  readFromBeginning?: boolean;
  handles: IIntegrationEventHandler<any>;
  handlerRetryPolicy?: {
    attempts: number;
    delay: number;
    exponentialBackOff: boolean;
  };
  noAvroDecoding?: boolean;
}
