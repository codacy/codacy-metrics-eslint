import { CLIEngine, Linter } from "eslint"
import { flatMap } from "lodash"

import { CodacyResult, LineComplexity } from "./model/codacyResult"

const ComplexityRegex = /(?:Arrow function|Function|Constructor|Method)\s*.*?\s*has a complexity of (\d+)\. Maximum allowed is 0\./

export function convertResults(report: CLIEngine.LintReport): CodacyResult[] {
  return flatMap(report.results, result => {
    const filename = result.filePath
    
    const lineComplexities = result.messages.reduce<LineComplexity[]>((acc, m) => {
      const line = m.line
      const complexity = m.message.match(ComplexityRegex)
      if (complexity && complexity.length == 2) {
        const parsedComplexity = parseInt(complexity[1])
        if (parsedComplexity != NaN)
          acc.push(new LineComplexity(line, parsedComplexity))
      }
      return acc
    }, [])
    const complexity = Math.max(...lineComplexities.map(lc => lc.value))
    return new CodacyResult(filename, complexity, lineComplexities)
  })
}

export function resultString(results: CodacyResult[]): string {
  const lines = results.map(result => JSON.stringify(result))
  return lines.join("\n")
}
