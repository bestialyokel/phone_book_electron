
class ContactsRepository {
    constructor() {}

    async save() {}

    async get() {}
    
}

export default Array(30).fill().map((x,i) => ({name: i, number: i * i * i}) )