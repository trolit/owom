import { IUserDto } from "./dtos/IUserDto";
import { USER1, USER2 } from "./data";
import { User } from "./models/User";
import { IOwom } from "@owom";

export const includeTests = ({
  owomResolver,
  Mapper,
}: {
  owomResolver: () => IOwom;
  Mapper: any;
}) => {
  const owom = owomResolver();

  it("should return expected object", () => {
    const result = owom.map<User, IUserDto>(USER1.beforeMap).to(Mapper);

    expect(result).toMatchObject(USER1.afterMap);
  });

  it("should return expected collection", () => {
    const result = owom
      .map<User, IUserDto>([USER1.beforeMap, USER2.beforeMap])
      .to(Mapper);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(USER1.afterMap);
    expect(result[1]).toMatchObject(USER2.afterMap);
  });
};
