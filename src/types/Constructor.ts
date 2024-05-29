import { IConstructorOptions } from "./IConstructorOptions";
import { OwomMapper } from "OwomMapper";
import { IOwom } from "./IOwom";

// T - source type, Y - target type
export type Constructor<T, Y> = new (
  data: T,
  owom?: IOwom,
  options?: IConstructorOptions,
) => OwomMapper<Y>;
