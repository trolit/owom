import { faker } from "@faker-js/faker";

import { ICommentDto } from "./dtos/ICommentDto";
import { Comment } from "./models/Comment";
import { User } from "./models/User";

const firstName = "Ab";
const lastName = "Kevinsky";

const USER: User = {
  firstName,
  lastName,
};

export const DATE = new Date(2024, 3, 1);

const createComment: () => {
  beforeMap: Comment;
  afterMap: ICommentDto;
} = () => {
  const value = faker.word.words({ count: 6 });

  return {
    beforeMap: {
      value,
      createdAt: DATE,
      updatedAt: DATE,
      user: USER,
    },
    afterMap: {
      author: `${firstName} ${lastName}`,
      value,
      publishedAt: DATE.toISOString(),
    },
  };
};

export const COMMENT_1 = createComment();
export const COMMENT_2 = createComment();
export const COMMENT_3 = createComment();

const createPost = () => {
  const title = faker.word.words({ count: 6 });
  const value = faker.word.words({ count: 6 });

  return {
    beforeMap: {
      title,
      value,
      createdAt: DATE,
      updatedAt: DATE,
      user: USER,
      comments: [COMMENT_1.beforeMap, COMMENT_2.beforeMap, COMMENT_3.beforeMap],
    },
    afterMap: {
      author: `${firstName} ${lastName}`,
      title,
      value,
      publishedAt: DATE.toISOString(),
      comments: [COMMENT_1.afterMap, COMMENT_2.afterMap, COMMENT_3.afterMap],
    },
  };
};

export const POST_1 = createPost();
export const POST_2 = createPost();
