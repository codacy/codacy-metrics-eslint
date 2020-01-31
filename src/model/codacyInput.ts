export class Codacyrc {
  readonly files?: string[]
  readonly language?: string

  constructor(files?: string[], language?: string) {
    this.files = files
    this.language = language
  }
}
