import assert from "assert"

import { defaultTimeout, parseTimeoutSeconds } from "../parseTimeoutSeconds"

describe("parseTimeoutSeconds", () => {
  it("should parse timeout with seconds", () => {
    assert.deepStrictEqual(parseTimeoutSeconds("60"), 60)
    assert.deepStrictEqual(parseTimeoutSeconds("1"), 1)
  })
  it("should return defaultTimeout when timeout is not correct", () => {
    assert.deepStrictEqual(parseTimeoutSeconds("blabla"), defaultTimeout)
  })
})
