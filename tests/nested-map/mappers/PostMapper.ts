import "reflect-metadata";
import { injectable } from "inversify";

import { IOwom, OwomMapper } from "@owom";

import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { IPostDto } from "../dtos/IPostDto";
import { CommentMapper } from "./CommentMapper";
import { ICommentDto } from "../dtos/ICommentDto";

export class PostMapperWithoutDi extends OwomMapper<Post> implements IPostDto {
  author: string;
  title: string;
  value: string;
  publishedAt: string;
  comments: ICommentDto[];

  constructor(data: Post, owom: IOwom) {
    super(data, ["value", "title"]);

    const { user, createdAt, comments } = data;

    if (user) {
      this.author = `${user.firstName} ${user.lastName}`;
    }

    this.comments = owom.map(comments).to(CommentMapper);

    this.publishedAt = createdAt.toISOString();
  }
}

@injectable()
export class PostMapperWithDi extends OwomMapper<Post> implements IPostDto {
  author: string;
  title: string;
  value: string;
  publishedAt: string;
  comments: ICommentDto[];

  constructor(data: Post, owom: IOwom) {
    super(data, ["value", "title"]);

    const { user, createdAt, comments } = data;

    if (user) {
      this.author = `${user.firstName} ${user.lastName}`;
    }

    this.comments = owom
      .map<Comment, ICommentDto>(comments)
      .to("CommentMapper");

    this.publishedAt = createdAt.toISOString();
  }
}
