import { Constructor } from "./Constructor";
import { OwomMapper } from "@owom";

export type MapFuncWithoutDi<T> = <Y extends OwomMapper<T>>(
  Mapper: Constructor<T, Y>,
) => Y;

export type MapManyFuncWithoutDi<T> = <Y extends OwomMapper<T>>(
  Mapper: Constructor<T, Y>,
) => Y[];

export type MapFuncWithDi<Y> = (token: string) => Y;

export type MapManyFuncWithDi<Y> = (token: string) => Y[];
