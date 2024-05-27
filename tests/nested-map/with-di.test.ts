import { IOwom, useOwom } from "@owom";
import { Container } from "inversify";

import { CommentMapper } from "./mappers/CommentMapper";
import { PostMapperWithDi } from "./mappers/PostMapper";
import { IPostDto } from "./dtos/IPostDto";
import { POST_1, POST_2 } from "./data";
import { Post } from "./models/Post";

enum Di {
  PostMapper = "PostMapper",
  CommentMapper = "CommentMapper",
}

describe("nested map (with DI)", () => {
  let owom: IOwom;

  beforeAll(() => {
    const container = new Container();
    container.bind(Di.PostMapper).toConstructor(PostMapperWithDi);
    container.bind(Di.CommentMapper).toConstructor(CommentMapper);

    owom = useOwom({
      di: token => container.get(token),
    });
  });

  it("should return valid mapped object", () => {
    const result = owom.map<Post, IPostDto>(POST_1.beforeMap).to(Di.PostMapper);

    expect(result).toMatchObject(POST_1.afterMap);
  });

  it("should return valid collection of mapped objects", () => {
    const result = owom
      .map<Post, IPostDto>([POST_1.beforeMap, POST_2.beforeMap])
      .to(Di.PostMapper);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(POST_1.afterMap);
    expect(result[1]).toMatchObject(POST_2.afterMap);
  });
});
