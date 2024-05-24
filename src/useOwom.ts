import { Owom } from "./Owom";
import { IOwom } from "./types/IOwom";
import { Options } from "./types/Options";

export const useOwom = (options: Options): IOwom => {
  return new Owom(options);
};
