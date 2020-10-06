
class ContactsRepository {
    constructor() {
        this._contacts = [
            {name: "Ачурин", number: "1"},
            {name: "Бчурин", number: "2"},
            {name: "Вчурин", number: "3"},
            {name: "Гчурин", number: "4"},
            {name: "Дчурин", number: "5"},
        ];
    }

    async save(number, name) {
        this._contacts.push({name, number});
        return 1;
    }

    async getAll() {
        return this._contacts;
    }
}

export default ContactsRepository;