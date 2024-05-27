import { Constructor } from "./Constructor";

export type DiResolver = (token: string) => Constructor<any, any>;

export type Options = {
  di?: DiResolver;
};
