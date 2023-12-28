import * as fs from "node:fs"
export function createIfNot(dir:string) {
  try {
    if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir,{ recursive: true })
  }
  } catch (err) {
    console.log(err);
  }
}
