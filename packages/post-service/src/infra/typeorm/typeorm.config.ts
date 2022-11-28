import { injectable } from "inversify";
import { DataSource } from "typeorm";
import { AppSettings } from "../../settings/app.settings";
import { Post } from "./models/Post.model";

@injectable()
export class DataSourceApp {
  private appDataSource: DataSource;

  constructor() {
    this.appDataSource = new DataSource({
      type: "mongodb",
      host: AppSettings.DB_HOST,
      port: Number(AppSettings.DB_PORT),
      database: AppSettings.DB_DATABASE,
      entities: [Post],
      synchronize: true,
      useUnifiedTopology: true
    });
  }

  public instance(): DataSource {
    if (!this.appDataSource) {
      new DataSourceApp();
    }
    return this.appDataSource;
  }
}

// for cli
export const AppDataSource: DataSource = new DataSourceApp().instance();
export interface IAppDataSource {
  instance(): DataSource;
}
