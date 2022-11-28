export interface IUserSignInProps {
  email: string;
  password: string;
}

export interface IUserProps extends IUserSignInProps {
  id?: string;
  name: string;
  savedPosts?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserWithTokenProps extends IUserProps {
  token: string;
}
