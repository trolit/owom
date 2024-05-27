import { IOwom, useOwom } from "@owom";

import { UserMapper } from "./mappers/UserMapper";
import { USER1, USER2 } from "./data";

describe("simple map (without DI)", () => {
  let owom: IOwom;

  beforeAll(() => {
    owom = useOwom({});
  });

  it("should return expected object", () => {
    const result = owom.map(USER1.beforeMap).to(UserMapper);

    expect(result).toMatchObject(USER1.afterMap);
  });

  it("should return expected collection", () => {
    const result = owom.map([USER1.beforeMap, USER2.beforeMap]).to(UserMapper);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(USER1.afterMap);
    expect(result[1]).toMatchObject(USER2.afterMap);
  });
});
