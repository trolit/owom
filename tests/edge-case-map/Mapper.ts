import { injectable } from "inversify";
import "reflect-metadata";

import { OwomMapper } from "@owom";

import { ITarget } from "./ITarget";
import { Source } from "./Source";

@injectable()
export class Mapper extends OwomMapper<Source> implements ITarget {
  name: string;
  status: boolean;
  publishedAt: string;

  constructor(data: Source) {
    super(data, ["name"]);

    const { status, createdAt } = data;

    this.status = status;

    this.publishedAt = createdAt.toISOString();
  }
}
