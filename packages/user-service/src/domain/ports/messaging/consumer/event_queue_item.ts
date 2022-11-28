import { IntegrationEvent } from "../integration_event_record";

export interface IEventQueueItem {
  topic: string;

  integrationEvent: IntegrationEvent;

  doNotCarryForwardSourceStampings?: boolean;
}
