import { IEventQueueItem } from "./event_queue_item";

export interface IEventQueue<T = IEventQueueItem> {
  push(item: T): Promise<void>;
  queueLength: number;
}

export interface IEventQueueOptions {
  retryDelay: number;

  maxRetries: number;

  maxTimeout: number;

  afterProcessDelay?: number;

  processTimeOut?: number;
}
