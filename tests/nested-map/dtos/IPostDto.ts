import { ICommentDto } from "./ICommentDto";

export interface IPostDto {
  author: string;

  title: string;

  value: string;

  publishedAt: string;

  comments: ICommentDto[];
}
