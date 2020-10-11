

import fs from "fs"
import {remote} from "electron"
import os from "os"



const SEPARATOR = ":";
const fileName = remote.process.argv.slice(2)[0];


if (!fs.existsSync(fileName)) {
    console.error(`file ${fileName} doesn't exists`);
}

class ContactsRepository {

    constructor() {
        this.contacts = [];
    }

    async getAll() {
        try {
            const data = fs.readFileSync(fileName)
                        .toString()
                        .split(os.EOL)
                        .map((line, index) => {
                            const idx = line.indexOf(SEPARATOR);
                            return (idx == -1) ? null : {number: line.slice(0, idx), name: line.slice(idx + 1), index};
                        })
                        //Можно добавить RegEx
                        .filter(x => x !== null);
            
            return data;         

        } catch(error) {
            console.error(error);
            return [];
        }              
    }


    async replace(list) {
        try {
            const data = list.map(x => `${x.number}${SEPARATOR}${x.name}`).join(os.EOL);
            fs.writeFileSync(fileName, data);
        } catch(error) {
            console.error(error);
        }
    }


    
}

//export default window && window.process && window.process.type ? ContactsRepositoryElectron : ContactsRepositoryBrowser

export default ContactsRepository