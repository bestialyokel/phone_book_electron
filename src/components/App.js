import React, { useEffect, useState } from 'react'

import styled, {ThemeContext, ThemeProvider} from "styled-components"

import ContactsRepository from "../data/repositoryBrowser"

import Header from "./Header"
import Contacts from "./Contacts"

import ContactsContext from "../context/ContactsContext"
import SearchContext from "../context/SearchContext"

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

    padding: 0 30px;
`

export default (props) => {

    const contactsRepository = new ContactsRepository();

    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState( String() );

    const SearchContextValue = {
        searchQuery,
        setSearchQuery
    };

    const ContactsContextValue = {
        contacts: contacts,
        addOne: ({name, number}) => {},
        removeByIdx: (idx) => {},
    };

    useEffect(() => {

        (async () => {
            const data = (await contactsRepository.getAll() )
                            .sort((a, b) => a.name.localeCompare(b.name));

            setContacts(data);

        })()

    }, []);



    return (
        <ThemeProvider theme={theme}>
        <ContactsContext.Provider value={ContactsContextValue}>
        <SearchContext.Provider value={SearchContextValue}>
            <AppContainer>
                <Header/>
                <Contacts/>
            </AppContainer>
        </SearchContext.Provider>
        </ContactsContext.Provider>
        </ThemeProvider>
    )
}