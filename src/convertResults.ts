import { CLIEngine, Linter } from "eslint"
import { flatMap } from "lodash"

import { CodacyResult, LineComplexity } from "./model/codacyResult"

const ComplexityRegex = /(?:Arrow function|Function|Constructor|Method)\s*.*?\s*has a complexity of (\d+)\. Maximum allowed is 0\./

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  return flatMap(report.results, result => {
    const filename = result.filePath
    const lineComplexities: LineComplexity[] = []
    result.messages.forEach(m => {
      const line = m.line
      const complexity = m.message.match(ComplexityRegex)
      if (complexity && complexity.length == 2) {
        const parsedComplexity = parseInt(complexity[1])
        if (parsedComplexity != NaN)
          lineComplexities.push(new LineComplexity(line, parsedComplexity))
      }
    })
    const complexity = lineComplexities.reduce((acc, lc) => Math.max(acc, lc.value), 0)
    return new CodacyResult(filename, complexity, lineComplexities)
  })
}

export function resultString(results: CodacyResult[]): string {
  const lines = results.map(result => JSON.stringify(result))
  return lines.join("\n")
}
