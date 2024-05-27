import "reflect-metadata";
import { injectable } from "inversify";

import { OwomMapper } from "@owom";

import { User } from "../models/User";
import { IUserDto } from "../dtos/IUserDto";

@injectable()
export class UserMapper extends OwomMapper<User> implements IUserDto {
  fullName: string;
  isActive: boolean;
  memberSince: string;

  constructor(data: User) {
    super(data, []);

    const { firstName, lastName, deletedAt, createdAt } = data;

    this.fullName = `${firstName} ${lastName}`;

    this.memberSince = createdAt.toISOString();

    this.isActive = !deletedAt;
  }
}
