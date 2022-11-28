interface IKafkaConfigParams {
  KAFKA_BROKERS: string[];
  KAFKA_SASL_MECHANISM?: string;
  KAFKA_CERTIFICATE_BASE64?: string;
  KAFKA_SCHEMA_REGISTRY_USERNAME?: string;
  KAFKA_SCHEMA_REGISTRY_PASSWORD?: string;
  KAFKA_SCHEMA_REGISTRY_URL?: string;
  KAFKA_CONNECTION_TIMEOUT?: number;
  KAFKA_TRANSACTION_TIMEOUT?: number;
  KAFKA_CONSUMER_GROUP_ID?: string;
  KAFKA_DEFAULT_DLQ_TOPIC?: string;
  KAFKA_CORRELATION_ID_MAX_LENGTH?: number;
}

class KafkaConfiguration {
  public KAFKA_SASL_MECHANISM: string;

  public KAFKA_SASL_USERNAME: string;

  public KAFKA_SASL_PASSWORD: string;

  public KAFKA_CERTIFICATE: string;

  public KAFKA_SCHEMA_REGISTRY_USERNAME: string;

  public KAFKA_SCHEMA_REGISTRY_PASSWORD: string;

  public KAFKA_BROKERS: string[];

  public KAFKA_SCHEMA_REGISTRY_URL: string;

  public KAFKA_CONNECTION_TIMEOUT: number;

  public KAFKA_CONSUMER_GROUP_ID: string;

  public KAFKA_TRANSACTION_TIMEOUT: number;

  public KAFKA_DEFAULT_DLQ_TOPIC: string;

  public KAFKA_CORRELATION_ID_MAX_LENGTH: number;

  constructor(kafkaConfigParams: IKafkaConfigParams) {
    this.KAFKA_BROKERS = kafkaConfigParams.KAFKA_BROKERS;
    this.KAFKA_SASL_MECHANISM = kafkaConfigParams.KAFKA_SASL_MECHANISM;
    this.KAFKA_CERTIFICATE = Buffer.from(kafkaConfigParams.KAFKA_CERTIFICATE_BASE64, "base64").toString("utf-8");
    this.KAFKA_SCHEMA_REGISTRY_PASSWORD = kafkaConfigParams.KAFKA_SCHEMA_REGISTRY_PASSWORD;
    this.KAFKA_SCHEMA_REGISTRY_URL = kafkaConfigParams.KAFKA_SCHEMA_REGISTRY_URL;
    this.KAFKA_SCHEMA_REGISTRY_USERNAME = kafkaConfigParams.KAFKA_SCHEMA_REGISTRY_USERNAME;
    this.KAFKA_CONNECTION_TIMEOUT = kafkaConfigParams.KAFKA_CONNECTION_TIMEOUT;
    this.KAFKA_TRANSACTION_TIMEOUT = kafkaConfigParams.KAFKA_TRANSACTION_TIMEOUT;
    this.KAFKA_CONSUMER_GROUP_ID = kafkaConfigParams.KAFKA_CONSUMER_GROUP_ID;
    this.KAFKA_DEFAULT_DLQ_TOPIC = kafkaConfigParams.KAFKA_DEFAULT_DLQ_TOPIC;
    this.KAFKA_CORRELATION_ID_MAX_LENGTH = kafkaConfigParams.KAFKA_CORRELATION_ID_MAX_LENGTH;
  }

  static getKafkaConfiguration(config: IKafkaConfigParams) {
    return new KafkaConfiguration(config);
  }
}

export { KafkaConfiguration, IKafkaConfigParams };
