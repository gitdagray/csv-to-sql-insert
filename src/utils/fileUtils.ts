import * as fs from 'node:fs'
export function createIfNot(filePath: string) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', { flag: 'wx' })
    }
}
