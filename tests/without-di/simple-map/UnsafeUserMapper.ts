import { OwomMapper } from "@owom";

import { User } from "./User";
import { IUserDto } from "./IUserDto";

export class UnsafeUserMapper extends OwomMapper<User> implements IUserDto {
  fullName: string;
  isActive: boolean;
  memberSince: string;

  constructor(data: User) {
    super(data, []);

    const { firstName, lastName, deletedAt, createdAt } = data;

    this.fullName = `${firstName} ${lastName}`;

    // unsafe
    this.memberSince = createdAt.toISOString();

    this.isActive = !deletedAt;
  }
}
