import { OwomMapper } from "../OwomMapper";

export type DiResolver = (token: string) => OwomMapper<any>;

export type Options = {
  di?: DiResolver;
};
