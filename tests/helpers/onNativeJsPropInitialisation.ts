import { OwomMapper } from "@owom";

import { compilerOptions } from "../../tsconfig.json";

// @NOTE allows to test mapping when `useDefineForClassFields` is true
export const onNativeJsPropInitialisation = (mapper: OwomMapper<any>) => {
  if (compilerOptions.useDefineForClassFields) {
    mapper._.useInheritedKeys();
  }
};
