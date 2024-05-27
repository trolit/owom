import { User } from "./User";
import { Comment } from "./Comment";

export class Post {
  title: string;

  value: string;

  createdAt: Date;

  updatedAt: Date;

  user: User;

  comments: Comment[];
}
