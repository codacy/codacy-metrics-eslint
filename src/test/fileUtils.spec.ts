import { deepEqual } from "assert"
import chai from "chai"

import { parseCodacyrcFile } from "../fileUtils"
import { Codacyrc } from "../model/codacyInput"

describe("fileUtils", () => {
  describe("parseCodacyrcFile", () => {
    it("should parse a codacyrc file", () => {
      const codacyrcFileContent = `{
        "files" : [ "foo/bar/baz.scala", "foo2/bar/baz.scala" ],
        "language": "Scala"
      }`
      const parsed = parseCodacyrcFile(codacyrcFileContent)
      const expected: Codacyrc = {
        files : [ "foo/bar/baz.scala", "foo2/bar/baz.scala" ],
        language: "Scala"
      }
      deepEqual(parsed, expected)
    })
    it("should parse a codacyrc file with no files", () => {
      const codacyrcFileContent = `{
        "language": "Scala"
      }`
      const parsed = parseCodacyrcFile(codacyrcFileContent)
      const expected: Codacyrc = {
        language: "Scala"
      }
      deepEqual(parsed, expected)
    })
    it("should parse a codacyrc file with no tools", () => {
      const codacyrcFileContent = `{
      "files" : ["foo/bar/baz.js", "foo2/bar/baz.php"]
    }`
      const parsed = parseCodacyrcFile(codacyrcFileContent)
      const expected: Codacyrc = {
        files: ["foo/bar/baz.js", "foo2/bar/baz.php"]
      }
      deepEqual(parsed, expected)
    })
    it("should fail with an invalid codacyrc file", () => {
      const wrongCodacyrcFileContent = `{`
      chai.expect(() => parseCodacyrcFile(wrongCodacyrcFileContent)).to.throw()
    })
  })
})
