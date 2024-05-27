import {
  MapFuncWithDi,
  MapFuncWithoutDi,
  MapManyFuncWithDi,
  MapManyFuncWithoutDi,
} from "types/Map";
import { DiResolver, Options } from "./types/Options";
import { Constructor } from "types/Constructor";
import { OwomMapper } from "./OwomMapper";
import { IOwom } from "./types/IOwom";

export class Owom implements IOwom {
  private _diResolver?: DiResolver;

  constructor({ di }: Options) {
    if (di) {
      this._diResolver = di;
    }
  }
  map<T>(entity: T): { to: MapFuncWithoutDi<T> };
  map<T>(entity: T[]): { to: MapManyFuncWithoutDi<T> };
  map<T, Y>(entity: T): { to: MapFuncWithDi<Y> };
  map<T, Y>(entity: T[]): { to: MapManyFuncWithDi<Y> };

  map<T, Y = void>(
    entity: T | T[],
  ):
    | { to: MapFuncWithoutDi<T> }
    | { to: MapManyFuncWithoutDi<T> }
    | { to: MapFuncWithDi<Y> }
    | { to: MapManyFuncWithDi<Y> } {
    if (this._diResolver) {
      return this._resolveMapWithDi<T, Y>(entity);
    }

    return this._resolveMapWithConcreteType(entity);
  }

  private _resolveMapWithConcreteType<T>(entity: T | T[]) {
    return Array.isArray(entity)
      ? {
          to: <Y extends OwomMapper<T>>(Mapper: Constructor<T, Y>) =>
            entity.map(entity => this._performMap(entity, Mapper)),
        }
      : {
          to: <Y extends OwomMapper<T>>(Mapper: Constructor<T, Y>) =>
            this._performMap(entity, Mapper),
        };
  }

  private _resolveMapWithDi<T, Y>(
    entity: T | T[],
  ): { to: MapFuncWithDi<Y> } | { to: MapManyFuncWithDi<Y> } {
    return {
      to: token => {
        const Mapper = this._diResolver(token);

        return Array.isArray(entity)
          ? entity.map(entity => this._performMap(entity, Mapper))
          : this._performMap(entity, Mapper);
      },
    };
  }

  private _performMap<T, Y>(entity: T, Mapper: Constructor<T, Y>) {
    return new Mapper(entity, this);
  }
}
