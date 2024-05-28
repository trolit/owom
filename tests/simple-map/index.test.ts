import { useOwom } from "@owom";

import { UserMapper } from "./mappers/UserMapper";
import { includeTests } from "./includeTests";
import { Container } from "inversify";

describe("simple map", () => {
  enum Di {
    UserMapper = "UserMapper",
  }

  describe("with DI", function () {
    includeTests({
      owomResolver: () => {
        const container = new Container();
        container.bind(Di.UserMapper).toConstructor(UserMapper);

        return useOwom({
          di: token => container.get(token),
        });
      },

      Mapper: Di.UserMapper,
    });
  });

  describe("without DI", function () {
    includeTests({
      owomResolver: useOwom,

      Mapper: UserMapper,
    });
  });
});
