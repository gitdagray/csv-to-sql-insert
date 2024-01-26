import type { Config } from '@jest/types'



/**   @type {import('ts-jest').JestConfigWithTsJest} */

const config: Config.InitialOptions =  {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  verbose:true,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  };



export default config