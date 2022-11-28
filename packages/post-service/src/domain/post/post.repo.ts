import { Post } from "./post";
import { IPostProps } from "./post.props";

export interface IPostRepository {
  getById(id: string): Promise<Post>;
  getAll(): Promise<Post[]>;
  create(post: IPostProps): Promise<Post>;
  update(post: IPostProps): Promise<Post>;
  deleteById(id :string): Promise<string>;
}
