export interface ProducerOptions {
  noAvroEncoding?: boolean;
  doNotCarryForwardSourceStampings?: boolean;
  doNotOverrideEventSource?: boolean;
  nonTransactional?: boolean;
}
