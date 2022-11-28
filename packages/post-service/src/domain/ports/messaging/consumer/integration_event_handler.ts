import { IIntegrationEventHandlerResponse, IntegrationEventRecord } from "../integration_event_record";

export interface IIntegrationEventHandler<T> {
  handle: (event: IntegrationEventRecord<T>) => Promise<IIntegrationEventHandlerResponse>;
}
