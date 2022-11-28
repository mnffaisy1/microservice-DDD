import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";
import { IUserRepository } from "../../domain/users/user.repo";
import { container } from "../../inversify.config";
import { PostEvents, Topics } from "../constants/messaging.constants";
import { TYPES } from "../constants/types";
class PostConsumer {
  private userRepo = container.get<IUserRepository>(TYPES.UserRepository);
  public onPostCreated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Created],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  public onPostUpdated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Updated],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  public onPostDeleted(): SubscriptionParameters {
    const userRepo = this.userRepo;
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Deleted],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          const users = await userRepo.getBySavedPosts(event.value.id);
          for (let index = 0; index < users.length; index++) {
            const user = users[index];
            user.props.savedPosts = user.props.savedPosts.filter(
              (savedPost) => {
                return savedPost !== event.value.id;
              }
            );
            await userRepo.update({
              ...user.props,
              id: user.id.toString()
            });
          }

          console.log(`Consumed Post Delete Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }
}

const postConsumer = new PostConsumer();

export default [
  postConsumer.onPostCreated(),
  postConsumer.onPostUpdated(),
  postConsumer.onPostDeleted()
];
