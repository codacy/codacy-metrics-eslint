import { ESLint } from "eslint"

import { defaultOptions } from "./eslintDefaultOptions"
import { debug } from "./logging"
import { readCodacyrcFile } from "./fileUtils"

export async function createEslintConfig(
  srcDirPath: string
): Promise<[ESLint.Options, string[]]> {
  debug("config: creating")

  const defaultFilesToAnalyze = [
    srcDirPath + "/**"
  ]
  const options = generateEslintOptions(srcDirPath)

  const codacyrc = await readCodacyrcFile(srcDirPath + "/.codacyrc")
  const files = codacyrc?.files?.length > 0 ? codacyrc.files : defaultFilesToAnalyze

  debug("config: finished")
  return [options, files]
}

function generateEslintOptions(
  srcDirPath: string
): ESLint.Options {
  debug("options: creating")
  
  const options = defaultOptions

  options.cwd = srcDirPath
  options.errorOnUnmatchedPattern = false
  options.resolvePluginsRelativeTo = "."
  options.useEslintrc = false

  debug("options: finished")
  return options
}
