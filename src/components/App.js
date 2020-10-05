import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'


import ContactsRepository from "../data/repositoryElectron"



export default (props) => {

    const contactsRepository = new ContactsRepository();

    const [contacts, setContacts] = useState([]);

    const addContact = async (number, name) => {
        const result = await contactsRepository.save(number, name);

        if (!result) {
            return;
        }

    }

    useEffect(() => {

        (async () => {
            const data = await contactsRepository.getAll().sort((a, b) => a.name.localeCompare(b.name))


            setContacts(data);
        })()

    }, []);



    return contacts.map(x => {



        return (<div>{x}</div>)
    })
}