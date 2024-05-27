import { Options } from "./types/Options";
import { IOwom } from "./types/IOwom";
import { Owom } from "./Owom";

export const useOwom = (options: Options): IOwom => {
  return new Owom(options);
};
