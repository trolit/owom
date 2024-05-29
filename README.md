Slightly expanded implementation of one way entity mapper service 📦 ➡️ 📦 taken from [itvault](https://github.com/trolit/itvault/). It uses constructors to store mapping config and contracts (interface) to offer reusability in monorepos while utilizing strong-typing in every place (when combined with TypeScript).

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
    super(data, ["id", "name"]); // pass keys/props that should be inherited (validated against any typos)
  }
}
```

`OwomMapper<T>` "protects" properties/keys names that are supposed to be inherited and performs reassignment from source data. Implementation of `IProductDto` forces to maintain appropriate shape of the mapper while at the same time opens possibility to expose that type to other sections of monorepo project. Other parts like `manufacturer` can be manually assigned:

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
> It's worth noticing that above solution is future-proof property initialisation, nevertheless of `useDefineForClassFields` flag state.

Alternatively, you could modify [`private _executeMap<T, Z>(entity: T, Mapper: Constructor<T, Z>)`](./src/Owom.ts) and call map of inherited keys/properties there but in such case you would have to either accept that inherited properties are not available when configuring custom mapping:

```ts
private _executeMap<T, Z>(entity: T, Mapper: Constructor<T, Z>) {
  const mapper = new Mapper(entity, this);
  mapper._._mapInheritedKeys(); // <-------------

  return <Z>mapper;
}

export class ProductMapper extends OwomMapper<Product> implements IProductDto {
  id: string;
  name: string;

  constructor(data: Product) {
    super(data, ["id", "name"]);

    // not needed
    // this.useInheritedKeys();

    // but inherited keys ('id', 'name')
    // would not be available as "_mapInheritedKeys" is called after object instantiation
    console.log(this.name); // undefined
  }
}
```

or you would have to rework it by forcing users to implement function (e.g. `handleCustomMap`) and place custom mapping there:

```ts
private _executeMap<T, Z>(entity: T, Mapper: Constructor<T, Z>) {
  const mapper = new Mapper(entity, this);

  mapper._._mapInheritedKeys();
  mapper._._handleCustomMap(); // inherited keys are available
  mapper._._clean();

  return <Z>mapper;
}
```

To find out more regarding `useDefineForClassFields`, check https://angular.schule/blog/2022-11-use-define-for-class-fields
