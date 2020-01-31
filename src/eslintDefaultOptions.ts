import { CLIEngine } from "eslint"

export const defaultOptions: CLIEngine.Options = {
  baseConfig: {
    env: {
      es6: true,
      node: true,
      browser: true,
      commonjs: true,
      jquery: true,
      phantomjs: true,
      jasmine: true,
      mocha: true,
      amd: true,
      worker: true,
      qunit: true
    },
    parser: "babel-eslint",
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        parser: "@typescript-eslint/parser"
      }
    ],
    rules: {
      complexity: [1, 0]
    }
  },
  cwd: "/src"
}
