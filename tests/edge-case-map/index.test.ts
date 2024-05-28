import { useOwom } from "@owom";

import { includeTests } from "./includeTests";
import { SafeMapper } from "./SafeMapper";
import { Container } from "inversify";
import { Mapper } from "./Mapper";

describe("edge-case map", () => {
  enum Di {
    Mapper = "Mapper",
    SafeMapper = "SafeMapper",
  }

  describe("with DI", function () {
    includeTests({
      owomResolver: () => {
        const container = new Container();

        container.bind(Di.Mapper).toConstructor(Mapper);
        container.bind(Di.SafeMapper).toConstructor(SafeMapper);

        return useOwom({
          di: token => container.get(token),
        });
      },

      Mapper: Di.Mapper,
      SafeMapper: Di.SafeMapper,
    });
  });

  describe("without DI", function () {
    includeTests({
      owomResolver: useOwom,

      Mapper,
      SafeMapper,
    });
  });
});
