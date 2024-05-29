import tseslint from "typescript-eslint";

// when using VSC, don't forget to enable - "eslint.experimental.useFlatConfig"
export default tseslint.config(
  {
    ignores: ["node_modules/*", "dist/*"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
