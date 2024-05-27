const DATA_KEY = "DATA";
const INHERITED_KEYS_KEY = "INHERITED_KEYS";

export class OwomMapper<T> {
  constructor(data: T, inheritedKeys?: (keyof T)[]) {
    this[DATA_KEY] = data;
    this[INHERITED_KEYS_KEY] = inheritedKeys;

    this.useInheritedKeys();
  }

  // @NOTE needs to be called manually in mapper when useDefineForClassFields is true
  protected useInheritedKeys() {
    this._map();

    this._removeTemporaryProperties();
  }

  private _removeTemporaryProperties() {
    delete this[DATA_KEY];
    delete this[INHERITED_KEYS_KEY];
  }

  private _map() {
    if (!this[INHERITED_KEYS_KEY]) {
      return;
    }

    this[INHERITED_KEYS_KEY].map((key: keyof T) => {
      const value = this[DATA_KEY][key];

      // @TODO add option to assign even if undefined
      if (typeof value !== "undefined") {
        (this as any)[key] = value;
      }
    });
  }
}
