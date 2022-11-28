import dotenv from "dotenv";

dotenv.config();

export class AppSettings {
  public static readonly PORT = process.env.APP_PORT || 3000;
  public static readonly DB_USER_NAME = process.env.DB_USER_NAME;
  public static readonly DB_HOST = process.env.DB_HOST;
  public static readonly DB_PORT = process.env.DB_PORT;
  public static readonly DB_PASSWORD = process.env.DB_PASSWORD;
  public static readonly DB_DATABASE = process.env.DB_DATABASE;
  public static readonly KAFKA_BROKER = process.env.KAFKA_BROKER;

}
