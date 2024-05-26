import { IOwom, useOwom } from "@owom";

import { User } from "./User";
import { IUserDto } from "./IUserDto";
import { SafeUserMapper } from "./SafeUserMapper";
import { UnsafeUserMapper } from "./UnsafeUserMapper";

describe("Simple map tests (without DI)", () => {
  let owom: IOwom;
  let user1: { beforeMap: User; afterMap: IUserDto };
  let user2: { beforeMap: User; afterMap: IUserDto };

  beforeAll(() => {
    owom = useOwom({});
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 3, 1));

    user1 = {
      beforeMap: {
        firstName: "Abe",
        lastName: "Kasky",
        password: "1234",
        createdAt: new Date(),
        deletedAt: null,
      },
      afterMap: {
        fullName: `Abe Kasky`,
        memberSince: new Date().toISOString(),
        isActive: true,
      },
    };

    user2 = {
      beforeMap: {
        firstName: "Kink",
        lastName: "Ab",
        password: "5678",
        createdAt: new Date(),
        deletedAt: new Date(),
      },
      afterMap: {
        fullName: `Kink Ab`,
        memberSince: new Date().toISOString(),
        isActive: false,
      },
    };
  });

  it("should throw error when mapping object with unsecured 'createdAt' property", () => {
    const invoke = () => {
      owom.map({}).to(UnsafeUserMapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should throw error when mapping collection with unsecured 'createdAt' property", () => {
    const invoke = () => {
      owom.map([user1.beforeMap, {}]).to(UnsafeUserMapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should NOT throw error when mapping object is secured", () => {
    const invoke = () => {
      owom.map({}).to(SafeUserMapper);
    };

    expect(invoke).not.toThrow(TypeError);
  });

  it("should NOT throw error when mapping collection is secured", () => {
    const invoke = () => {
      owom.map([user1.beforeMap, {}]).to(SafeUserMapper);
    };

    expect(invoke).not.toThrow(TypeError);
  });

  it("should return valid mapped object", () => {
    const result = owom.map(user1.beforeMap).to(UnsafeUserMapper);

    expect(result).toMatchObject(user1.afterMap);
  });

  it("should return valid collection of mapped objects", () => {
    const result = owom
      .map([user1.beforeMap, user2.beforeMap])
      .to(UnsafeUserMapper);

    expect(result).toMatchObject([user1.afterMap, user2.afterMap]);
  });
});
