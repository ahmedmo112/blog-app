import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  // {files: ["**/*.{js,mjs,cjs,ts}"]},
  // {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  // {languageOptions: { globals: globals.browser }},
  {
    extends:[
      'airbnb',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      semi: "error",
      "prefer-const": "error"
  }
}
];