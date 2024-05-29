import { OwomMapper } from "@owom";

import { onNativeJsPropInitialisation } from "../../helpers/onNativeJsPropInitialisation";
import { IUserDto } from "../dtos/IUserDto";
import { User } from "../models/User";

export class UserMapper extends OwomMapper<User> implements IUserDto {
  fullName: string;
  isActive: boolean;
  memberSince: string;

  constructor(data: User) {
    super(data);
    onNativeJsPropInitialisation(this);

    const { firstName, lastName, deletedAt, createdAt } = data;

    this.fullName = `${firstName} ${lastName}`;

    this.memberSince = createdAt.toISOString();

    this.isActive = !deletedAt;
  }
}
