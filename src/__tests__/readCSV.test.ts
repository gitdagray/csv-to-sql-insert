import { expect, test, describe, beforeAll, afterAll, vi } from 'vitest'
import * as fs from 'fs'
import path from 'path'

import * as index from '../index'
import { expectedOutput, testInputData } from './testData'

// Our spies
const readCSVspy = vi.spyOn(index, 'readCSV')

// Filesystem spies
const readFileSpy = vi.spyOn(fs.promises, 'readFile')

describe('readCSV test', () => {
    beforeAll(async () => {
        fs.writeFileSync(path.resolve('./csv/test.csv'), testInputData)
        await index.readCSV()
    })

    afterAll(() => {
        fs.rmSync(path.resolve('./csv/test.csv'))
        fs.rmSync(path.resolve('./sql/test.sql'))
    })

    test('readCSV is called once', () => {
        expect(readCSVspy).toHaveBeenCalledTimes(1)
    })

    test('readFile should be called with "test" as filename argument', () => {
        expect(readFileSpy).toHaveBeenCalledWith('csv/test.csv', { encoding: 'utf8' })
    })

    test('readFile should return test input data', () => {
        expect(readFileSpy).toHaveReturnedWith(testInputData)
    })

    test('should write a .sql file', () => {
        expect(fs.existsSync(path.resolve('./sql/test.sql'))).toBe(true)
    })

    test('should write a correct SQL statement', () => {
        // console.log(fs.readFileSync(path.resolve('./sql/test.sql')).toString())
        expect(fs.readFileSync(path.resolve('./sql/test.sql')).toString()).toBe(expectedOutput)
    })
})
