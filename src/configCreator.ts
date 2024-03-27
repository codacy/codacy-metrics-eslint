import { ESLint } from "eslint"

import { defaultOptions } from "./eslintDefaultOptions"
import { readCodacyrcFile } from "./fileUtils"

export async function createEslintConfig(
  srcDirPath: string
): Promise<[ESLint.Options, string[]]> {
  const defaultFilesToAnalyze = [
    srcDirPath + "/**"
  ]
  const options = generateEslintOptions(srcDirPath)

  const codacyrc = await readCodacyrcFile("/.codacyrc")
  const files = codacyrc?.files?.length > 0 ? codacyrc.files : defaultFilesToAnalyze

  return [options, files]
}

function generateEslintOptions(
  srcDirPath: string
): ESLint.Options {
  const options = defaultOptions

  options.cwd = srcDirPath
  options.errorOnUnmatchedPattern = false
  options.resolvePluginsRelativeTo = "."
  options.useEslintrc = false

  return options
}
