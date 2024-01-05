import { readFile, readdir } from "fs/promises";
import path from "path";

import { Codacyrc } from "./model/codacyInput";

export async function readCodacyrcFile(file: string): Promise<Codacyrc | undefined> {
  try {
    return parseCodacyrcFile(await readFile(file, { encoding: "utf8" }))
  } catch (e) {
    console.error(`Error reading ${file} file`)
    return undefined
  }
}

export function parseCodacyrcFile(content: string): Codacyrc {
  return JSON.parse(content)
}

export async function allFilesNames(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir, { withFileTypes: true, recursive: true }))
      .filter((entry) => entry.isFile() || entry.isSymbolicLink())
      .map((entry) => path.relative(dir, entry.name))
  } catch (error) {
    console.error(`Error reading directory ${dir}`);
    return []
  }
}