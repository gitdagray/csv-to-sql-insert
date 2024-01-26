import { writeSQL } from "../index";

import { promises as fs, existsSync} from "fs";

//I DECIDED TO TEST WRITESQL FUNCTION BECAUSE READ CSV ULTIMATELY CALLS UPON WRITE SQL

describe('csv to sql test suite', () => {
    jest.mock('fs', () => ({
        existsSync: jest.fn(),
        mkdirSync: jest.fn(),
        mkdir: jest.fn(),
        appendFile: jest.fn(),
        writeFile: jest.fn()
    }));
    //const existsSyncSpy = jest.spyOn(fs, 'existsSync');
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdir');
    const appendFileSpy = jest.spyOn(fs, 'appendFile');
    const writeFileSpy = jest.spyOn(fs, 'writeFile');
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should write to a new SQL file exclusively',()=>{
        //arrange
       const sqlStatement = `INSERT INTO ExampleTable (id, description, entryDate, location, rate, isActive)
       VALUES`
       const filePath = "./ExampleTable.csv"
       const isAppend = false
       
       //act
         writeSQL(sqlStatement, filePath,isAppend)
        
       
       //assert
       expect(appendFileSpy).not.toHaveBeenCalled()
       expect(writeFileSpy).toHaveBeenCalled()
    
       
       })
    
    
    
    it('should append to an existing SQL file,but not create a new one' ,()=>{
     //arrange
    const sqlStatement = `INSERT INTO ExampleTable (id, description, entryDate, location, rate, isActive)
    VALUES`
    const filePath = "./ExampleTable.csv"
    const isAppend = true
    
    //act
     writeSQL(sqlStatement, filePath,isAppend)
     
    
    //assert
    
    expect(writeFileSpy).not.toHaveBeenCalled()
       expect(appendFileSpy).toHaveBeenCalled()
    
    
    })


});
