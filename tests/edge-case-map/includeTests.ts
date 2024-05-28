import { ITarget } from "./ITarget";
import { Source } from "./Source";
import { IOwom } from "@owom";

export const includeTests = ({
  owomResolver,
  Mapper,
  SafeMapper,
}: {
  owomResolver: () => IOwom;
  Mapper: any;
  SafeMapper: any;
}) => {
  const owom = owomResolver();

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
};
