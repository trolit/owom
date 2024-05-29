import { DiResolver, Options } from "types/Options";
import { MapManyFunc, MapOneFunc } from "types/Map";
import { Constructor } from "types/Constructor";
import { IOwom } from "types/IOwom";

export class Owom implements IOwom {
  private _diResolver?: DiResolver;

  constructor(options?: Options) {
    if (!options) {
      return;
    }

    const { di } = options;

    if (di) {
      this._diResolver = di;
    }
  }

  map<T, Z>(entity: T): { to: MapOneFunc<T, Z> };
  map<T, Z>(entity: T[]): { to: MapManyFunc<T, Z> };
  map<T, Z>(
    entity: T | T[],
  ): { to: MapOneFunc<T, Z> } | { to: MapManyFunc<T, Z> } {
    return {
      to: Mapper => {
        if (typeof Mapper === "string") {
          return this._resolveWithDi<T>(entity, Mapper);
        }

        return this._resolveWithConcreteType<T, Z>(entity, Mapper);
      },
    };
  }

  private _resolveWithConcreteType<T, Z>(
    entity: T | T[],
    Mapper: Constructor<T, Z>,
  ) {
    return Array.isArray(entity)
      ? entity.map(entity => this._executeMap(entity, Mapper))
      : this._executeMap(entity, Mapper);
  }

  private _resolveWithDi<T>(entity: T | T[], token: string) {
    const Mapper = this._diResolver(token);

    return Array.isArray(entity)
      ? entity.map(entity => this._executeMap(entity, Mapper))
      : this._executeMap(entity, Mapper);
  }

  private _executeMap<T, Z>(entity: T, Mapper: Constructor<T, Z>) {
    const mapper = new Mapper(entity, this);

    // @NOTE here you can cover extra options, referring to Mapper instance

    mapper._.removeTemporaryData();

    // @NOTE free to cast as outcome of Mapper instantiation is supposed to match "Z"
    return <Z>mapper;
  }
}
