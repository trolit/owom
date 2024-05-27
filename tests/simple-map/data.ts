import { faker } from "@faker-js/faker";

import { User } from "./models/User";
import { IUserDto } from "./dtos/IUserDto";

export const DATE = new Date(2024, 3, 1);

const createUser: (isActive: boolean) => {
  beforeMap: User;
  afterMap: IUserDto;
} = isActive => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    beforeMap: {
      firstName,
      lastName,
      password: "1234",
      createdAt: DATE,
      deletedAt: isActive ? null : DATE,
    },
    afterMap: {
      fullName: `${firstName} ${lastName}`,
      memberSince: DATE.toISOString(),
      isActive,
    },
  };
};

export const USER1 = createUser(true);
export const USER2 = createUser(false);
