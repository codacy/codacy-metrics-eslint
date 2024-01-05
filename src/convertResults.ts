import { ESLint } from "eslint"
import { flatMap } from "lodash"

import { CodacyResult, LineComplexity } from "./model/codacyResult"

const ComplexityRegex = /.*has a complexity of (\d+).*/

export function convertResults(eslintResults: ESLint.LintResult[]): CodacyResult[] {
  const convertedResults: CodacyResult[] = []

  eslintResults.forEach((r) => {
    const filename = r.filePath
    const lineComplexities: LineComplexity[] = []

    r.messages
      .filter((m) => 
        m.ruleId === "complexity"
        && m.message?.match(ComplexityRegex)?.length === 2
      )
      .forEach((m) => {
        const complexityMatch = m.message.match(ComplexityRegex)

        if (complexityMatch) {
          lineComplexities.push(new LineComplexity(m.line, parseInt(complexityMatch[1], 10)))
        }
      })

    const complexity = lineComplexities.reduce((acc, lc) => Math.max(acc, lc.value), 0)
    convertedResults.push(new CodacyResult(filename, complexity, lineComplexities))
  })

  return convertedResults
}
