Refactored & expanded implementation of one way entity mapper service 📦 ➡️ 📦 taken from [itvault](https://github.com/trolit/itvault/). It uses constructors to store mapping config and contracts (interface) to offer reusability in monorepos while utilizing strong-typing in every place (when combined with TypeScript).

### Usage

```ts
const owom = useOwom();

const mappedUser = owom.map<User, IUserDto>(user).to(UserMapper);
const mappedUsers = owom.map<User, IUserDto>(users).to(UserMapper);
```

There is also an option to resolve mappers by registering them using IoC container like [inversify](https://github.com/inversify):

```ts
import { Container } from "inversify";

const container = new Container();
container.bind("UserMapper").toConstructor(UserMapper);

const owom = useOwom({ di: token => container.get(token) });

const mappedUser = owom.map<User, IUserDto>(user).to("UserMapper");
const mappedUsers = owom.map<User, IUserDto>(users).to("UserMapper");
```

### Example

Imagine project with model:

```ts
export class Product {
  id: string;
  name: string;
  priceInCents: number;
  manufacturer: Manufacturer;
}
```

and there is need to return it to the API consumer in following way:

```ts
export interface IProductDto {
  id: string;
  name: string;
  price: { value: number; currency: string };
  manufacturer: { id: string; name: string };
}
```

Initialize mapper using base class:

```ts
export class ProductMapper extends OwomMapper<Product> implements IProductDto {
  id: string;
  name: string;
  price: { value: number; currency: string };
  manufacturer: { id: string; name: string };

  constructor(data: Product) {
    super(data, ["id", "name"]); // pass keys/props that should be inherited (type-safety validated)
  }
}
```

Extending `OwomMapper` makes inherited keys mapping logic reusable and protects properties/keys names that are supposed to be inherited. Implementation of `IProductDto` forces to maintain appropriate shape of the mapper while at the same time opening possibility to expose that type to other sections of monorepo project. Other parts like `manufacturer` can be manually assigned:

```ts
constructor(data: Product) {
    const { manufacturer: { mid, title } } = data;

    this.manufacturer = { id: mid, name: title };
}
```

or mapped using `owom` instance:

```ts
constructor(data: Product, owom: IOwom) {
    const { priceInCents, manufacturer } = data;

    this.manufacturer = owom
                            .map<Manufacturer, IManufacturerDto>(manufacturer)
                            .to(ManufacturerMapper);
}
```

> [!NOTE]
> When using TypeScript and `useDefineForClassFields` flag is `true` (it is by default when `target` is `E2022` or higher, including `ESNext`, [reference](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields)) it changes the way how properties are initialized in classes. This affects approach based on inheritance, resulting in invalid outcome. To fix it either disable flag or recall inherited keys mapping in each mapper:

```ts
export class ProductMapper extends OwomMapper<Product> implements IProductDto {
  id: string;
  name: string;
  price: { value: number; currency: string };
  manufacturer: { id: string; name: string };

  constructor(data: Product) {
    super(data, ["id", "name"]);

    this.useInheritedKeys(); // <--------------
  }
}
```

> [!NOTE]
> It's worth noting that recall solution is future-proof property initialisation, nevertheless of flag state!

To find out more regarding `useDefineForClassFields`, view https://angular.schule/blog/2022-11-use-define-for-class-fields
