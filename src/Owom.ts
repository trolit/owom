import { IOwom } from "./types/IOwom";
import { OwomMapper } from "./OwomMapper";
import { DiResolver, Options } from "./types/Options";

export class Owom implements IOwom {
  private _diResolver?: DiResolver;

  constructor({ di }: Options) {
    if (di) {
      this._diResolver = di;
    }
  }

  map<T>(entity: T): {
    to: <Y extends OwomMapper<T>>(mapper: new (data: T) => Y) => Y;
  };
  map<T>(entity: T[]): {
    to: <Y extends OwomMapper<T>>(mapper: new (data: T) => Y) => Y[];
  };
  map<T, Y>(entity: T): { to: (token: string) => Y };
  map<T, Y>(entity: T[]): { to: (token: string) => Y[] };

  map<T, Y = void>(
    entity: T | T[]
  ):
    | {
        to: <Y extends OwomMapper<T>>(mapper: new (data: T) => Y) => Y;
      }
    | { to: <Y extends OwomMapper<T>>(mapper: new (data: T) => Y) => Y[] }
    | { to: (token: string) => Y }
    | { to: (token: string) => Y[] } {
    if (this._diResolver) {
      return <{ to: (token: string) => Y } | { to: (token: string) => Y[] }>(
        this._resolveWithDi(entity)
      );
    }

    return Array.isArray(entity)
      ? {
          to: <Y extends OwomMapper<T>>(
            mapper: new (data: T, owom: IOwom) => Y
          ) => {
            return entity.map((entity) => new mapper(entity, this));
          },
        }
      : {
          to: <Y extends OwomMapper<T>>(
            mapper: new (data: T, owom: IOwom) => Y
          ) => {
            return new mapper(entity, this);
          },
        };
  }

  private _resolveWithDi<T, Y>(
    entity: T | T[]
  ): { to: (token: string) => Y | Y[] } {
    const toImplementation = (token: string): Y | Y[] => {
      const Mapper: { new (data: T, owom: IOwom) } = <any>(
        this._diResolver(token)
      );

      return Array.isArray(entity)
        ? entity.map((entity) => new Mapper(entity, this))
        : new Mapper(entity, this);
    };

    return { to: (token: string) => toImplementation(token) };
  }
}
