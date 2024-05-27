import "reflect-metadata";
import { injectable } from "inversify";

import { OwomMapper } from "@owom";

import { Source } from "./Source";
import { ITarget } from "./ITarget";

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
