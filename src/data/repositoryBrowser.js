
class ContactsRepository {
    constructor() {
        this._contacts = [
            {name: "Ачурин", number: "+79613308969"},
            {name: "Бчурин", number: "2"},
            {name: "Вчурин", number: "3"},
            {name: "Гчурин", number: "4"},
            {name: "Дчурин", number: "5"},
            {name: "Ычурин", number: "6"},
            {name: "Ччурин", number: "7"},
            {name: "Ячурин", number: "8"},
            {name: "Пчурин", number: "9"},

        ].map((x,i) => ({...x, index: i}) );
    }


    async replace(arr) {
        this._contacts.length = 0;
        this._contacts = arr;
    }
    
    async getAll() {
        return this._contacts;
    }

    /*
    async save(data) {
        console.log(this._contacts);
        this._contacts.push({...data, index: this._contacts.length});
        console.log(this._contacts);
        return 1;
    }

    async deleteByIdx(idx) {

        if (idx < 0 || idx >= this._contacts.length) 
            throw "bad index";

        for (let i = idx; i < this._contacts.length - 1; i++) {
            this._contacts[i] = this._contacts[i + 1];
            this._contacts[i].index -= 1;
        }

        this._contacts.length -= 1;


    }



    async updateByIdx(idx, data) {

        if (idx < 0 || idx >= this._contacts.length)
            throw "bad index";

        this._contacts[idx] = {...data, index: idx};
    }

    */

    async appendList(list) {
        try {
            this._contacts = this._contacts.concat(list);
        } catch(e) {
            console.error(e);
        }
    }

    async exportIndexes(indexes) {
        const data = indexes.map(i => this._contacts[i]);
    }

}

export default ContactsRepository;