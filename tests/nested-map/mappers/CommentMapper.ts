import { OwomMapper } from "@owom";

import { onNativeJsPropInitialisation } from "../../helpers/onNativeJsPropInitialisation";
import { ICommentDto } from "../dtos/ICommentDto";
import { Comment } from "../models/Comment";

export class CommentMapper extends OwomMapper<Comment> implements ICommentDto {
  author: string;
  value: string;
  publishedAt: string;

  constructor(data: Comment) {
    super(data, ["value"]);
    onNativeJsPropInitialisation(this);

    const { user, createdAt } = data;

    if (user) {
      this.author = `${user.firstName} ${user.lastName}`;
    }

    this.publishedAt = createdAt.toISOString();
  }
}
