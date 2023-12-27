import { expect, test, describe, afterEach, vi } from 'vitest'
import { createIfNot } from '../utils/fileUtils'
import * as fs from 'node:fs'

const FILE_PATH = 'test.txt'

vi.mock('node:fs', () => ({
    existsSync: vi.fn(),
    writeFileSync: vi.fn()
}))

const existsSyncSpy = vi.spyOn(fs, 'existsSync')
const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync')

describe('createIfNot test', () => {
    afterEach(() => {
        existsSyncSpy.mockReset()
        writeFileSyncSpy.mockReset()
    })

    test('should create file if not exists', () => {
        existsSyncSpy.mockReturnValue(false)
        createIfNot(FILE_PATH)
        expect(writeFileSyncSpy).toHaveBeenCalledWith(FILE_PATH, '', { flag: 'wx' })
    })

    test('should not create file if exists', () => {
        existsSyncSpy.mockReturnValue(true)
        createIfNot(FILE_PATH)
        expect(writeFileSyncSpy).not.toHaveBeenCalled()
    })
})
