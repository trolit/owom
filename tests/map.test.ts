import { onNativeJsPropInitialisation } from "./helpers/onNativeJsPropInitialisation";
import { IOwom, OwomMapper, useOwom } from "@owom";

describe("map", () => {
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
      .map<Model, ITarget>({ name: "abc", status: true, createdAt })
      .to(Mapper);

    expect(result).toMatchObject({
      name: "abc",
      status: true,
      publishedAt: createdAt.toISOString(),
    });
  });

  it("should return expected collection", () => {
    const result = owom
      .map<Model, ITarget>([{ name: "1" } as any, {}, { name: "2" }])
      .to(SafeMapper);

    expect(result).toEqual([{ name: "1" }, {}, { name: "2" }]);
  });
});

// -----------------------------------

class Model {
  name: string;
  status?: boolean;
  createdAt: Date;
}

interface ITarget {
  name: string;
  status: boolean;
  publishedAt: string;
}

class Mapper extends OwomMapper<Model> implements ITarget {
  name: string;
  status: boolean;
  publishedAt: string;

  constructor(data: Model) {
    super(data, ["name"]);
    this.useInheritedKeys();

    const { status, createdAt } = data;

    this.status = status;

    this.publishedAt = createdAt.toISOString();
  }
}

class SafeMapper extends OwomMapper<Model> implements ITarget {
  name: string;
  status: boolean;
  publishedAt: string;

  constructor(data: Model) {
    super(data, ["name"]);
    onNativeJsPropInitialisation(this);

    const { status, createdAt } = data;

    this.status = status;

    // in real scenario though, we wouldn't add such check as createdAt is neither optional nor nullable
    if (createdAt) {
      this.publishedAt = createdAt.toISOString();
    }
  }
}
