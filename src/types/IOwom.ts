import { MapManyFunc, MapOneFunc } from "./Map";

export interface IOwom {
  map<T, Z>(entity: T): { to: MapOneFunc<T, Z> };

  map<T, Z>(entity: T[]): { to: MapManyFunc<T, Z> };
}
