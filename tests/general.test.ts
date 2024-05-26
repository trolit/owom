import { IOwom, OwomMapper, useOwom } from "@owom";

class Source {
  name: string;

  status?: boolean;
}

interface ITarget {
  name: string;

  status: boolean;
}

class Mapper extends OwomMapper<Source> implements ITarget {
  name: string;
  status: boolean;

  constructor(data: Source) {
    super(data, ["name"]);

    const { status } = data;

    this.status = status;
  }
}

// ------------------------------------------------------

describe("General tests", () => {
  let owom: IOwom;

  beforeAll(() => {
    owom = useOwom({});
  });

  it("should throw error when object is null", () => {
    const invoke = () => {
      owom.map(null).to(Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should throw error when one of objects to map is null", () => {
    const invoke = () => {
      owom.map([null, { name: "1" }, { name: "2" }]).to(Mapper);
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should return object with undefined props when object to map is empty", () => {
    const result = owom.map({}).to(Mapper);

    expect(result).toMatchObject({ name: undefined, status: undefined });
  });

  it("should return mapped object", () => {
    const result = owom.map({ name: "abc", status: true }).to(Mapper);

    expect(result).toMatchObject({ name: "abc", status: true });
  });

  it("should return mapped collection", () => {
    const result = owom.map([{ name: "1" }, {}, { name: "2" }]).to(Mapper);

    expect(result).toEqual([
      { name: "1", status: undefined },
      { name: undefined, status: undefined },
      { name: "2", status: undefined },
    ]);
  });
});
