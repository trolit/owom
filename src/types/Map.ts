import { Constructor } from "./Constructor";
import { OwomMapper } from "@owom";

export type MapOneFunc<T, Z> = <Y extends OwomMapper<T>>(
  Mapper: Constructor<T, Y> | string,
) => Z;

export type MapManyFunc<T, Z> = <Y extends OwomMapper<T>>(
  Mapper: Constructor<T, Y> | string,
) => Z[];
