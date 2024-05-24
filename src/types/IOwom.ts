import { OwomMapper } from "../OwomMapper";

export interface IOwom {
  map<T>(entity: T[]): {
    to: <Y extends OwomMapper<T>>(mapper: new (data: T) => Y) => Y[];
  };

  map<T>(entity: T): {
    to: <Y extends OwomMapper<T>>(mapper: new (data: T) => Y) => Y;
  };

  map<T, Y>(
    entity: T[]
  ): {
    to: (token: string) => Y[];
  };

  map<T, Y>(
    entity: T
  ): {
    to: (token: string) => Y;
  };
}
