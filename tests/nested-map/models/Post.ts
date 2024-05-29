import { Comment } from "./Comment";
import { User } from "./User";

export class Post {
  title: string;

  value: string;

  createdAt: Date;

  updatedAt: Date;

  user: User;

  comments: Comment[];
}
