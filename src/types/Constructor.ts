import { OwomMapper } from "OwomMapper";

// T - source type, Y - target type
export type Constructor<T, Y> = new (data: T, ...args: any[]) => OwomMapper<Y>;
