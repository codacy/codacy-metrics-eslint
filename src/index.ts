import { CLIEngine } from "eslint"

import { convertResults, resultString } from "./convertResults"
import { defaultOptions } from "./eslintDefaultOptions"
import { parseCodacyrcFile, readJsonFile } from "./fileUtils"
import { parseTimeoutSeconds } from "./parseTimeoutSeconds"

const timeoutHandle = setTimeout(() => {
  console.error("Timeout occurred. Exiting.")
  process.exit(2)
}, parseTimeoutSeconds(process.env.TIMEOUT_SECONDS) * 1000)

async function run() {
  const jsonFile = await readJsonFile("/.codacyrc")

  const codacyrc = jsonFile ? parseCodacyrcFile(jsonFile) : undefined

  const files = codacyrc?.files

  const srcDirPath = "/src"

  defaultOptions.resolvePluginsRelativeTo = "."

  defaultOptions.cwd = srcDirPath

  const filesToAnalyze = files && files.length > 0 ? files : ["/src/**"]

  const eslintResults = new CLIEngine(defaultOptions).executeOnFiles(filesToAnalyze)

  const codacyResults = convertResults(eslintResults).map(r => r.relativeTo(srcDirPath))

  const lines = resultString(codacyResults)

  console.log(lines)
}

run()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => clearTimeout(timeoutHandle))
