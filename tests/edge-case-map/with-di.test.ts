import { Container } from "inversify";

import { IOwom, useOwom } from "@owom";

import { SafeMapper } from "./SafeMapper";
import { ITarget } from "./ITarget";
import { Source } from "./Source";
import { Mapper } from "./Mapper";

enum Di {
  Mapper = "Mapper",
  SafeMapper = "SafeMapper",
}

describe("edge-case map (with DI)", () => {
  let owom: IOwom;

  beforeAll(() => {
    const container = new Container();

    container.bind(Di.Mapper).toConstructor(Mapper);
    container.bind(Di.SafeMapper).toConstructor(SafeMapper);

    owom = useOwom({
      di: token => container.get(token),
    });
  });

  it("should throw error when object is null", () => {
    const invoke = () => {
      owom.map(null).to(Di.Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should throw error when one of objects is null", () => {
    const invoke = () => {
      owom.map([null]).to(Di.Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should throw error when createdAt is empty", () => {
    const invoke = () => {
      owom.map({}).to(Di.Mapper);
      owom.map([{}, {}]).to(Di.Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should NOT throw error when createdAt is empty", () => {
    const invoke = () => {
      owom.map({}).to(Di.SafeMapper);
      owom.map([{}, {}]).to(Di.SafeMapper);
    };

    expect(invoke).not.toThrow(TypeError);
  });

  it("should return expected object", () => {
    const createdAt = new Date();

    const result = owom
      .map<Source, ITarget>({ name: "abc", status: true, createdAt })
      .to(Di.Mapper);

    expect(result).toMatchObject({
      name: "abc",
      status: true,
      publishedAt: createdAt.toISOString(),
    });
  });

  it("should return expected collection", () => {
    const result = owom
      .map<Source, ITarget>([{ name: "1" } as any, {}, { name: "2" }])
      .to(Di.SafeMapper);

    expect(result).toEqual([{ name: "1" }, {}, { name: "2" }]);
  });
});
