import { expect, test, describe, afterEach, vi } from 'vitest'
import { createIfNot } from '../utils/fileUtils'
import * as fs from 'node:fs'
import * as index from '../index'

const FILE_PATH = './test.txt'

vi.mock('node:fs', () => ({
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    promises: {
        readFile: vi.fn(),
        writeFile: vi.fn()
    }
}))

// Filesystem spies
const existsSyncSpy = vi.spyOn(fs, 'existsSync')
const mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync')

describe('createIfNot test', () => {
    afterEach(() => {
        existsSyncSpy.mockReset()
        mkdirSyncSpy.mockReset()
    })

    test('should create file if not exists', () => {
        existsSyncSpy.mockReturnValue(false)
        createIfNot(FILE_PATH)
        expect(mkdirSyncSpy).toHaveBeenCalledWith(FILE_PATH, { recursive: true })
    })

    test('should not create file if exists', () => {
        existsSyncSpy.mockReturnValue(true)
        createIfNot(FILE_PATH)
        expect(mkdirSyncSpy).not.toHaveBeenCalled()
    })
})
