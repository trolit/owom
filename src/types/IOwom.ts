import {
  MapFuncWithDi,
  MapFuncWithoutDi,
  MapManyFuncWithDi,
  MapManyFuncWithoutDi,
} from "./Map";

export interface IOwom {
  map<T>(entity: T[]): {
    to: MapManyFuncWithoutDi<T>;
  };

  map<T>(entity: T): {
    to: MapFuncWithoutDi<T>;
  };

  map<T, Y>(
    entity: T[],
  ): {
    to: MapManyFuncWithDi<Y>;
  };

  map<T, Y>(
    entity: T,
  ): {
    to: MapFuncWithDi<Y>;
  };
}
