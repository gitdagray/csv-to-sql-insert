import * as fs from "node:fs"
import * as path from "path"
export function createIfNot(filePath:string) {
  const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        
        // create a file
        fs.closeSync(fs.openSync(filePath, 'w'));
    }
}
