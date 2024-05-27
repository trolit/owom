import { Container } from "inversify";
import { IOwom, useOwom } from "@owom";

import { User } from "./models/User";
import { USER1, USER2 } from "./data";
import { IUserDto } from "./dtos/IUserDto";
import { UserMapper } from "./mappers/UserMapper";

enum Di {
  UserMapper = "UserMapper",
}

describe("simple map (with DI)", () => {
  let owom: IOwom;

  beforeAll(() => {
    const container = new Container();
    container.bind(Di.UserMapper).toConstructor(UserMapper);

    owom = useOwom({
      di: (token) => container.get(token),
    });
  });

  it("should return expected object", () => {
    const result = owom.map<User, IUserDto>(USER1.beforeMap).to(Di.UserMapper);

    expect(result).toMatchObject(USER1.afterMap);
  });

  it("should return expected collection", () => {
    const result = owom
      .map<User, IUserDto>([USER1.beforeMap, USER2.beforeMap])
      .to(Di.UserMapper);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(USER1.afterMap);
    expect(result[1]).toMatchObject(USER2.afterMap);
  });
});
