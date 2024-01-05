import { ESLint } from "eslint"

export const defaultOptions: ESLint.Options = {
  baseConfig: {
    env: {
      node: true,
      amd: true,
      browser: true,
      commonjs: true,
      es2022: true,
      es6: true,
      jasmine: true,
      jest: true,
      jquery: true,
      mocha: true,
      phantomjs: true,
      qunit: true,
      worker: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      sourceType: "script",
      allowAutomaticSingleRunInference: true,
      ecmaVersion: 2022,
      errorOnTypeScriptSyntacticAndSemanticIssues: false,
    },
    root: true,
    settings: {
      node: {
        paths: ["/src"],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".node", ".mjs", ".cjs", ".mts", ".cts"],
        tryExtensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".node", ".mjs", ".cjs", ".mts", ".cts"],
      },
    },
    overrides: [
      {
        files: ["*.ts", "*.tsx", "*.mts", ".cts"],
        parserOptions: {
          sourceType: "module",
        },
      },
    ],
    rules: {
      complexity: [1, 0],
    },
  },
  cwd: "/src",
  useEslintrc: false,
}
