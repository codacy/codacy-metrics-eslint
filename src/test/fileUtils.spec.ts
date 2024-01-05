import assert from "assert"

import { parseCodacyrcFile } from "../fileUtils"
import { Codacyrc } from "../model/codacyInput"

describe("fileUtils", () => {
  describe("parseCodacyrcFile", () => {
    it("should parse a codacyrc file", () => {
      const codacyrcFileContent = `{
        "files" : ["foo/bar/baz.scala", "foo2/bar/baz.scala"],
        "language": "Scala"
      }`
      const parsed = parseCodacyrcFile(codacyrcFileContent)
      const expected: Codacyrc = {
        files: ["foo/bar/baz.scala", "foo2/bar/baz.scala"],
        language: "Scala"
      }
      assert.deepStrictEqual(parsed, expected)
    })
    it("should parse a codacyrc file with no files", () => {
      const codacyrcFileContent = `{
        "language": "Scala"
      }`
      const parsed = parseCodacyrcFile(codacyrcFileContent)
      const expected: Codacyrc = {
        language: "Scala"
      }
      assert.deepStrictEqual(parsed, expected)
    })
    it("should parse a codacyrc file with no tools", () => {
      const codacyrcFileContent = `{
      "files" : ["foo/bar/baz.js", "foo2/bar/baz.php"]
    }`
      const parsed = parseCodacyrcFile(codacyrcFileContent)
      const expected: Codacyrc = {
        files: ["foo/bar/baz.js", "foo2/bar/baz.php"]
      }
      assert.deepStrictEqual(parsed, expected)
    })
    it("should fail with an invalid codacyrc file", () => {
      const wrongCodacyrcFileContent = `{`;
      
      let errorOccurred = false
    
      try {
        parseCodacyrcFile(wrongCodacyrcFileContent)
      } catch (error) {
        errorOccurred = true
      }
    
      assert.strictEqual(errorOccurred, true, 'Expected an error to be thrown')
    })
  })
})
