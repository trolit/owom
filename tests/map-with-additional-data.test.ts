import { onNativeJsPropInitialisation } from "./helpers/onNativeJsPropInitialisation";
import { IOwom, IOwomConstructorOptions, OwomMapper, useOwom } from "@owom";

describe("map with additional data", () => {
  let owom: IOwom;

  beforeAll(() => {
    owom = useOwom();
  });

  it("should return object with undefined currency", () => {
    const result = owom.map<Model, IDto>({ princeInCents: 50 }).to(Mapper);

    expect(result).toMatchObject({
      price: {
        value: 0.5,
        currency: undefined,
      },
    });
  });

  it("should return expected object", () => {
    const result = owom
      .map<Model, IDto>({ princeInCents: 50 })
      .to(Mapper, { additionalData: { currency: "USD" } });

    expect(result).toMatchObject({
      price: {
        value: 0.5,
        currency: "USD",
      },
    });
  });
});

// -----------------------------------

interface IDto {
  price: { value: number; currency: string };
}

class Model {
  princeInCents: number;
}

class Mapper extends OwomMapper<Model> implements IDto {
  price: { value: number; currency: string };

  constructor(data: Model, owom: IOwom, options: IOwomConstructorOptions) {
    super(data, []);
    onNativeJsPropInitialisation(this);

    const {
      additionalData: { currency },
    } = options;

    this.price = {
      value: data.princeInCents / 100,
      currency,
    };
  }
}
