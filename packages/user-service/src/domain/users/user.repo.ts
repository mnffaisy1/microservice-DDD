import { User } from "./user";
import {
  IUserProps,
  IUserSignInProps,
  IUserWithTokenProps
} from "./user.props";

export interface IUserRepository {
  getById(id: string): Promise<User>;
  getAll(): Promise<User[]>;
  signUp(user: IUserProps): Promise<User>;
  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps>;
  update(user: IUserProps): Promise<User>;
  savePost(id: string, postid: string): Promise<User>;
  getBySavedPosts(postId: string): Promise<User[]>;
}
