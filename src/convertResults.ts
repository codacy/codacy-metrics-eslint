import { ESLint } from "eslint"

import { CodacyResult, LineComplexity } from "./model/codacyResult"

const ComplexityRegex = /.*has a complexity of (\d+).*/

export function convertResults(eslintResults: ESLint.LintResult[]): CodacyResult[] {
  const convertedResults: CodacyResult[] = []

  eslintResults.forEach((result) => {
    const filename = result.filePath
    const lineComplexities: LineComplexity[] = []

    result.messages
      .filter((message) => 
        message.ruleId === "complexity"
        && message.message?.match(ComplexityRegex)?.length === 2
      )
      .forEach((message) => {
        const complexityMatch = message.message.match(ComplexityRegex)

        if (complexityMatch === null) return
        
        lineComplexities.push(new LineComplexity(message.line, parseInt(complexityMatch[1], 10)))
      })

    const complexity = lineComplexities.reduce((acc, lc) => Math.max(acc, lc.value), 0)
    convertedResults.push(new CodacyResult(filename, complexity, lineComplexities))
  })

  return convertedResults
}
