import React, { useEffect, useState } from 'react'

import styled, {ThemeContext, ThemeProvider} from "styled-components"

import ContactsRepository from "../data/repositoryBrowser"

import Header from "./Header"
import Contacts from "./Contacts"

const theme = {
    backgroundColor: "black",
    primaryTextColor: "white",
    disabledColor: "grey",
    secondaryTextColor: "grey",
    specialTextColor: "blue",
    fontBase: "10px"
}

const AppContainer = styled.div`
    background-color: ${props => props.theme.backgroundColor};
    width: 100%;
    height: 100%;
    color: ${props => props.theme.primaryTextColor};
    font-size: ${props => props.theme.fontBase};
`

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
            const data = (await contactsRepository.getAll() )
                            .sort((a, b) => a.name.localeCompare(b.name));

            setContacts(data);

        })()

    }, []);



    return (
        <ThemeProvider theme={theme}>
            <AppContainer>
                <Header/>
                
            </AppContainer>
        </ThemeProvider>
    )
}