import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";
import { User as UserModel } from "../../typeorm/models/User.model";
import { User } from "../../../domain/users/user";
import { IUserRepository } from "../../../domain/users/user.repo";
import {
  IUserSignInProps,
  IUserWithTokenProps
} from "../../../domain/users/user.props";
import { hashIt } from "../../encryption";
import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { CustomError } from "../../errors/base.error";
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";
import axios from "axios";
import { AppSettings } from "../../../settings/app.settings";
import { IDomainProducerMessagingRepository } from "../../../domain/ports/messaging/producer";
import {
  Topics,
  UserEvents
} from "../../../application/constants/messaging.constants";
import { v4 } from "uuid";

@injectable()
export class UserRepository implements IUserRepository {
  protected logger: ILogger;
  protected userDataSource: MongoRepository<UserModel>;
  protected producer: IDomainProducerMessagingRepository;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource,
    @inject(TYPES.MessagingProducer)
    producer: () => IDomainProducerMessagingRepository
  ) {
    this.logger = logger.get();
    this.userDataSource = appDataSource
      .instance()
      .getMongoRepository(UserModel);
    this.producer = producer();
  }

  async getAll(): Promise<User[]> {
    try {
      const res = await this.userDataSource.find();
      const users: User[] = [];
      res.forEach((element) => {
        users.push(User.create({ ...element, id: element.id.toString() }));
      });
      return users;
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGetAll - ${err}`);
      throw err;
    }
  }

  async savePost(id: string, postId: string): Promise<User> {
    try {
      try {
        await axios({
          method: "get",
          url: `${AppSettings.POST_SERVICE_URL}/api/v1/posts/${postId}`
        });
      } catch (error) {
        throw new CustomError({
          message: "Invalid postId",
          status: error.status,
          errorCode: error.response.data.errorCode
        });
      }

      let existingUser = await this.userDataSource.findOneBy({
        _id: getObjectId(id)
      });
      if (!existingUser) {
        throw new CustomError({
          message: "Invalid user id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }
      if (!existingUser.savedPosts) {
        existingUser.savedPosts = [];
      }
      existingUser.savedPosts.push(postId);
      existingUser.savedPosts = [...new Set(existingUser.savedPosts)];
      existingUser = this.userDataSource.create({ ...existingUser });
      await this.userDataSource.findOneAndUpdate(
        {
          _id: existingUser.id
        },
        { $set: existingUser }
      );

      return User.create({ ...existingUser, id: existingUser.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositorsavePost - ${err}`);
      throw err;
    }
  }

  async signUp(user: User): Promise<User> {
    try {
      const check = await this.userDataSource.findOneBy({ email: user.email });

      if (check) {
        throw new CustomError({
          message: "User already exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      user.password = hashIt(user.password);
      const userToSave = this.userDataSource.create(user);
      const res = await this.userDataSource.save(userToSave);
      this.producer.publish(
        Topics.UserService,
        {
          // partition: 0,
          dateTimeOccurred: new Date(),
          eventId: v4(),
          data: { ...user, id: userToSave.id },
          value: { ...user, id: userToSave.id },
          eventSource: Topics.UserService,
          eventType: UserEvents.Signup
        },
        {
          noAvroEncoding: true,
          nonTransactional: true
        }
      );
      return User.create({ ...res, id: res.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositorySignUp - ${err}`);

      throw err;
    }
  }

  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps> {
    throw new Error("Method not implemented.");
  }

  async update(user: User): Promise<User> {
    this.logger.info(`User ${JSON.stringify(user)}`);
    let existingUser = await this.userDataSource.findOneBy({
      _id: getObjectId(user.id)
    });
    this.logger.info(`Check ${JSON.stringify(existingUser)}`);

    try {
      if (!existingUser) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      if (user.password) {
        user.password = hashIt(user.password);
      }
      
      
      existingUser = this.userDataSource.create({ ...existingUser, ...user });
      await this.userDataSource.findOneAndUpdate(
        {
          _id: getObjectId(user.id)
        },
        { $set: existingUser }
      );

      return User.create({ ...existingUser, id: existingUser.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryUpdate - ${err}`);

      throw err;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userDataSource.findOneBy({
        _id: getObjectId(id)
      });

      if (!user) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      return User.create({ ...user, id: user.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGet - ${err}`);

      throw err;
    }
  }

  async getBySavedPosts(postId: string): Promise<User[]> {
    try {
      

      const savedPosts = await this.userDataSource.findBy({
        savedPosts: postId
      });

      const users: User[] = [];
      savedPosts.forEach((element) => {
        users.push(User.create({ ...element, id: element.id.toString() }));
      });
      return users;
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGet - ${err}`);

      throw err;
    }
  }
}
