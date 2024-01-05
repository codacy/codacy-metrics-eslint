import { ESLint } from "eslint"

import { convertResults } from "./convertResults"
import { createEslintConfig } from "./configCreator"
import { parseTimeoutSeconds } from "./parseTimeoutSeconds"

const srcDirPath = "/src"
const timeoutSeconds = parseTimeoutSeconds(process.env.TIMEOUT_SECONDS)

const timeoutHandle = setTimeout(() => {
  console.error("Timeout occurred. Exiting.")
  process.exit(2)
}, timeoutSeconds * 1000)

async function run() {
  const [options, files] = await createEslintConfig(srcDirPath)
  const eslint = new ESLint(options)
  const eslintResults = await eslint.lintFiles(files)

  const lines = convertResults(eslintResults)
    .map(r => JSON.stringify(r.relativeTo(srcDirPath)))
    .join("\n")

  console.log(lines)
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => clearTimeout(timeoutHandle))
