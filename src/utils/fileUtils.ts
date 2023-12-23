import * as fs from 'node:fs'

export function createIfNot(dir: string): void {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
}
