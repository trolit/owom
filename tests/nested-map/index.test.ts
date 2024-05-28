import { useOwom } from "@owom";

import { PostMapperWithDi, PostMapperWithoutDi } from "./mappers/PostMapper";
import { CommentMapper } from "./mappers/CommentMapper";
import { includeTests } from "./includeTests";
import { Container } from "inversify";

describe("nested map", () => {
  enum Di {
    PostMapper = "PostMapper",
    CommentMapper = "CommentMapper",
  }

  describe("with DI", function () {
    includeTests({
      owomResolver: () => {
        const container = new Container();
        container.bind(Di.PostMapper).toConstructor(PostMapperWithDi);
        container.bind(Di.CommentMapper).toConstructor(CommentMapper);

        return useOwom({
          di: token => container.get(token),
        });
      },

      Mapper: Di.PostMapper,
    });
  });

  describe("without DI", function () {
    includeTests({
      owomResolver: useOwom,

      Mapper: PostMapperWithoutDi,
    });
  });
});
