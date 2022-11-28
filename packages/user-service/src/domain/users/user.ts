import { Entity } from "../entity";
import { IUserProps } from "./user.props";

export class User extends Entity<IUserProps> {
  private constructor(props: IUserProps) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IUserProps): User {
    const instance = new User(props);
    return instance;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.name;
  }

  get email(): string {
    return this.email;
  }

  set password(text: string) {
    this.password = text;
  }

  get password(): string {
    return this.password;
  }

  get savedPosts(): string[] {
    return this.savedPosts;
  }

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}
