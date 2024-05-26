import { OwomMapper } from "@owom";

import { User } from "../models/User";
import { IUserDto } from "../dtos/IUserDto";

export class SafeUserMapper extends OwomMapper<User> implements IUserDto {
  fullName: string;
  isActive: boolean;
  memberSince: string;

  constructor(data: User) {
    super(data, []);

    const { firstName, lastName, deletedAt, createdAt } = data;

    this.fullName = `${firstName} ${lastName}`;

    // safe
    if (createdAt) {
      this.memberSince = createdAt.toISOString();
    }

    this.isActive = !!deletedAt;
  }
}
