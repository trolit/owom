import { IPostDto } from "./dtos/IPostDto";
import { POST_1, POST_2 } from "./data";
import { Post } from "./models/Post";
import { IOwom } from "@owom";

export const includeTests = ({
  owomResolver,
  Mapper,
}: {
  owomResolver: () => IOwom;
  Mapper: any;
}) => {
  const owom = owomResolver();

  it("should return valid mapped object", () => {
    const result = owom.map<Post, IPostDto>(POST_1.beforeMap).to(Mapper);

    expect(result).toMatchObject(POST_1.afterMap);
  });

  it("should return valid collection of mapped objects", () => {
    const result = owom
      .map<Post, IPostDto>([POST_1.beforeMap, POST_2.beforeMap])
      .to(Mapper);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(POST_1.afterMap);
    expect(result[1]).toMatchObject(POST_2.afterMap);
  });
};
