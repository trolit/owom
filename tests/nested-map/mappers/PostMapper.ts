import { IOwom, OwomMapper } from "@owom";

import { onNativeJsPropInitialisation } from "../../helpers/onNativeJsPropInitialisation";
import { ICommentDto } from "../dtos/ICommentDto";
import { CommentMapper } from "./CommentMapper";
import { Comment } from "../models/Comment";
import { IPostDto } from "../dtos/IPostDto";
import { Post } from "../models/Post";

export class PostMapper extends OwomMapper<Post> implements IPostDto {
  author: string;
  title: string;
  value: string;
  publishedAt: string;
  comments: ICommentDto[];

  constructor(data: Post, owom: IOwom) {
    super(data, ["value", "title"]);
    onNativeJsPropInitialisation(this);

    const { user, createdAt, comments } = data;

    if (user) {
      this.author = `${user.firstName} ${user.lastName}`;
    }

    this.comments = owom.map<Comment, ICommentDto>(comments).to(CommentMapper);

    this.publishedAt = createdAt.toISOString();
  }
}
