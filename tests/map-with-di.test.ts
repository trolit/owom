import { IOwom, OwomMapper, useOwom } from "@owom";

import { Container } from "inversify";

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

// -----------------------------------

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

  it("should resolve mapper and return expected result", () => {
    const result = owom
      .map<Model, IDto>({ id: "1", value: "some text" })
      .to(Mapper.name);

    expect(result).toMatchObject({
      text: "some text",
    });
  });
});
