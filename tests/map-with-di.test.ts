import { IOwom, OwomMapper, useOwom } from "@owom";

import { Container } from "inversify";

describe("map with di", () => {
  let owom: IOwom;

  beforeAll(() => {
    const container = new Container();

    container.bind(Mapper.name).toConstructor(Mapper);

    owom = useOwom({
      di: token => container.get(token),
    });
  });

  it("should throw error when using di without configuring resolver", () => {
    const localOwom = useOwom();

    const invoke = () => {
      localOwom.map({ a: 1, b: 2 }).to("SOME_TOKEN");
    };

    expect(invoke).toThrow(TypeError);
  });

  it("should resolve mapper and return expected object", () => {
    const result = owom
      .map<Model, IDto>({ id: "1", value: "some text" })
      .to(Mapper.name);

    expect(result).toMatchObject({
      text: "some text",
    });
  });

  it("should resolve mapper and return expected collection", () => {
    const result = owom
      .map<Model, IDto>([
        { id: "1", value: "text1" },
        { id: "2", value: "text2" },
      ])
      .to(Mapper.name);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      text: "text1",
    });
    expect(result[1]).toMatchObject({
      text: "text2",
    });
  });
});

// -----------------------------------

class Model {
  id: string;
  value: string;
}

interface IDto {
  text: string;
}

class Mapper extends OwomMapper<Model> implements IDto {
  text: string;

  constructor(data: Model) {
    super(data, []);

    this.text = data.value;
  }
}
