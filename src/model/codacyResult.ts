import { relative } from 'path'

export class LineComplexity {
  readonly line: number
  readonly value: number

  constructor(line: number, value: number) {
    this.line = line
    this.value = value
  }
}

export class CodacyResult {
  readonly filename: string
  readonly complexity: number
  readonly lineComplexities: LineComplexity[]

  constructor(filename: string, complexity: number, lineComplexities: LineComplexity[]) {
    this.filename = filename
    this.complexity = complexity
    this.lineComplexities = lineComplexities
  }

  relativeTo(directory: string): CodacyResult {
    const newFilename = relative(directory, this.filename)

    return new CodacyResult(newFilename, this.complexity, this.lineComplexities)
  }
}
