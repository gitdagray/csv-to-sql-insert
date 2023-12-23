export function getNamedArgs(){
   
    return process.argv.slice(2).reduce((args,arg)=>{
        if(arg.startsWith("--")){
            const [key,value]=arg.slice(2).split("=")
            args.set(key, value)
        
     }
     return args
    
    },new Map())
}
