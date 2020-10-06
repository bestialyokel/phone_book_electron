

import fs from "fs"
import {remote} from "electron"
import os from "os"



const SEPARATOR = " ";
const fileName = remote.process.argv.slice(2)[0];


if (!fs.existsSync(fileName)) {
    console.error(`file ${fileName} doesn't exists`);
}


class ContactsRepository {
    constructor() {}

    async save({name, number}) {
        const data = `${number} ${name}`;
        try {
            fs.appendFileSync(fileName, data);
            return true;
        } catch(error) {
            console.error(error);
            return false;
        }
    }

    async getAll() {
        try {
            const data = fs.readFileSync(fileName)
                        .toString()
                        .split(os.EOL)
                        .map(line => {
                            const idx = line.indexOf(SEPARATOR);
                            return (idx == -1) ? null : {number: line.slice(0, idx), name: line.slice(idx + 1)};
                        })
                        //Можно добавить RegEx
                        .filter(x => x !== null);
            
            return data;         

        } catch(error) {
            console.error(error);
            return [];
        }
                        
    }
}

//export default window && window.process && window.process.type ? ContactsRepositoryElectron : ContactsRepositoryBrowser

export default ContactsRepository