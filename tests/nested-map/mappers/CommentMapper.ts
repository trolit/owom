import "reflect-metadata";
import { injectable } from "inversify";

import { OwomMapper } from "@owom";

import { Comment } from "../models/Comment";
import { ICommentDto } from "../dtos/ICommentDto";

@injectable()
export class CommentMapper extends OwomMapper<Comment> implements ICommentDto {
  author: string;
  value: string;
  publishedAt: string;

  constructor(data: Comment) {
    super(data, ["value"]);

    const { user, createdAt } = data;

    if (user) {
      this.author = `${user.firstName} ${user.lastName}`;
    }

    this.publishedAt = createdAt.toISOString();
  }
}
