type AsyncCallback<T> = (...args : any[]) => Promise<T>

export const catchAsync = <T>(fn : AsyncCallback<T>) =>{
    return (...args : any []) => {
        fn(...args)
        .catch((err) => {
            console.error(err);
        });
    };
};