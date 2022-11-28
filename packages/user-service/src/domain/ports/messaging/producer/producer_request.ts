export interface IProducerRequest {
  topic: string[];
  partition?: number;
  seconds: number;
  key?: string;
  value: string;
  avroschemaName?: string;
  schemaId?: number;
  header: Record<string, string>;
}
