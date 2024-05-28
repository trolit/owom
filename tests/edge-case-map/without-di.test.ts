import { IOwom, useOwom } from "@owom";

import { SafeMapper } from "./SafeMapper";
import { ITarget } from "./ITarget";
import { Mapper } from "./Mapper";
import { Source } from "./Source";

describe("edge-case map (without DI)", () => {
  let owom: IOwom;

  beforeAll(() => {
    owom = useOwom();
  });

  it("should throw error when object is null", () => {
    const invoke = () => {
      owom.map(null).to(Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should throw error when one of objects is null", () => {
    const invoke = () => {
      owom.map<any, any>([null]).to(Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should throw error when createdAt is empty", () => {
    const invoke = () => {
      owom.map({}).to(Mapper);
      owom.map<any, any>([{}, {}]).to(Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should NOT throw error when createdAt is empty", () => {
    const invoke = () => {
      owom.map({}).to(SafeMapper);
      owom.map<any, any>([{}, {}]).to(SafeMapper);
    };

    expect(invoke).not.toThrow(TypeError);
  });

  it("should return expected object", () => {
    const createdAt = new Date();

    const result = owom
      .map<Source, ITarget>({ name: "abc", status: true, createdAt })
      .to(Mapper);

    expect(result).toMatchObject({
      name: "abc",
      status: true,
      publishedAt: createdAt.toISOString(),
    });
  });

  it("should return expected collection", () => {
    const result = owom
      .map<Source, ITarget>([{ name: "1" } as any, {}, { name: "2" }])
      .to(SafeMapper);

    expect(result).toEqual([{ name: "1" }, {}, { name: "2" }]);
  });
});
