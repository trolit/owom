import { onNativeJsPropInitialisation } from "./helpers/onNativeJsPropInitialisation";
import { IOwom, OwomMapper, useOwom } from "@owom";
import { faker } from "@faker-js/faker";

describe("map with object inheritance", () => {
  let owom: IOwom;

  beforeAll(() => {
    owom = useOwom();
  });

  it("should NOT throw error when author is empty", () => {
    const invoke = () => {
      owom.map<Comment, ICommentDto>(<any>{}).to(Mapper);
    };

    expect(invoke).not.toThrow(TypeError);
  });

  it("should return expected object", () => {
    const user: User = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 10, max: 30 }),
    };

    const value = faker.word.words(5);
    const source: Comment = { value, author: user };
    const target: ICommentDto = { text: value, author: user };

    const result = owom.map<Comment, ICommentDto>(source).to(Mapper);

    expect(result).toMatchObject(target);
  });
});

// -----------------------------------

class User {
  name: string;
  age: number;
}

class Comment {
  value: string;
  author: User;
}

interface ICommentDto {
  text: string;
  author: User;
}

class Mapper extends OwomMapper<Comment> implements ICommentDto {
  text: string;
  author: User;

  constructor(data: Comment) {
    super(data, ["author"]);
    onNativeJsPropInitialisation(this);

    this.text = data.value;
  }
}
