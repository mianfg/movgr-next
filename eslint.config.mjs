import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: true
});

const eslintConfig = [
  {
    ignores: ["node_modules/*", ".next/*", "dist/*"]
  },
  ...compat.extends(
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      typescript
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],
      "no-tabs": "error",
      "semi": ["error", "always"],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "import", "next": "*" },
        { "blankLine": "any", "prev": "import", "next": "import" }
      ]
    }
  }
];

export default eslintConfig;
