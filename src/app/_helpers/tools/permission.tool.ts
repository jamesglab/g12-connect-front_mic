
export const parseToObject = (array: any[], key:string, value: string): Promise<{ [ key: string]: string }> => {
    return new Promise(async (resolve, reject) => {
        let object = {};
        const iterateArray = async () => {
            return Promise.all(
                array.map((item)=> {
                    object[item[key]] = item[value];
                    return Promise.resolve('ok');
                })
            );
        }
        await iterateArray();
        resolve(object);
    }); 
}

export const validatePermission = (objects: { [ key: string]: string }, attrToSearch: string) => {
    return objects[attrToSearch] || null;
}
