export interface ConsumerOptions {
  sessionTimeout?: number;
  maxInFlightRequests?: number;
  retry?: {
    initialRetryTime: number;
    retries: number;
  };
  groupId?: string;
  autoCommitInterval?: number;
  autoCommitThreshold?: number;
}

export const DefaultConsumerOptions = {
  maxInFlightRequests: 1,
  autoCommitInterval: 5000,
  autoCommitThreshold: 1,
  retry: {
    initialRetryTime: 5000,
    retries: 1
  }
};
