import { v4 } from "uuid";

export interface IntegrationEventRecord<T = any> {
  value: T;
  eventId: string;
  eventSource: string;
  dateTimeOccurred: Date;
  data: T;
  eventType: string;
  schema?: string;
  schemaId?: number;
  topic?: string;
  offset?: string;
  partition?: number;
  context?: any;
  key?: string;
  readonly isCyclicEvent?: boolean;
}

export interface IIntegrationEventHandlerResponse {
  handled: boolean;
  unHandledReason?: string;
}

export interface IIntegrationEvent {
  eventSource: string;
  dateTimeOccurred: Date;
  eventType: string;
  domainCorrelationId: string;
  flatten(): IntegrationEventRecord;
  context: any;
}

export abstract class IntegrationEvent implements IIntegrationEvent {
  eventId: string;

  eventSource: string;

  dateTimeOccurred: Date;

  eventType: string;

  domainCorrelationId: string;

  context: any;

  key?: string;

  abstract flatten(): IntegrationEventRecord;

  constructor(eventType: string, eventSource: string, domainCorrelationId: string, context: any, key?: string) {
    this.domainCorrelationId = domainCorrelationId;
    this.eventType = eventType;
    this.eventSource = eventSource;
    this.dateTimeOccurred = new Date();
    this.eventId = v4();
    this.context = context;
    this.key = key;
  }
}
