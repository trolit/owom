import { IOwom, useOwom } from "@owom";

import { POST_1, POST_2 } from "./data";
import { PostMapperWithoutDi } from "./mappers/PostMapper";

describe("Nested map (without DI)", () => {
  let owom: IOwom;

  beforeAll(() => {
    owom = useOwom({});
  });

  it("should return valid mapped object", () => {
    const result = owom.map(POST_1.beforeMap).to(PostMapperWithoutDi);

    expect(result).toMatchObject(POST_1.afterMap);
  });

  it("should return valid collection of mapped objects", () => {
    const result = owom
      .map([POST_1.beforeMap, POST_2.beforeMap])
      .to(PostMapperWithoutDi);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(POST_1.afterMap);
    expect(result[1]).toMatchObject(POST_2.afterMap);
  });
});
