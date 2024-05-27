import { injectable } from "inversify";
import "reflect-metadata";

import { OwomMapper } from "@owom";

import { ITarget } from "./ITarget";
import { Source } from "./Source";

@injectable()
export class SafeMapper extends OwomMapper<Source> implements ITarget {
  name: string;
  status: boolean;
  publishedAt: string;

  constructor(data: Source) {
    super(data, ["name"]);

    const { status, createdAt } = data;

    this.status = status;

    // in real scenario though, we wouldn't add such check as createdAt is neither optional nor nullable
    if (createdAt) {
      this.publishedAt = createdAt.toISOString();
    }
  }
}
