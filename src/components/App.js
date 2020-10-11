import React, { useEffect, useState, useReducer } from 'react'

import styled, {ThemeContext, ThemeProvider, createGlobalStyle} from "styled-components"

import ContactsRepository from "../data/repositoryElectron"

import Header from "./Header"
import Contacts from "./Contacts"

import ContactsContext from "../context/ContactsContext"
import SearchContext from "../context/SearchContext"
import ModeContext from "../context/ModeContext"

const dialog = require("electron").remote.dialog;

import os from "os"

import fs from "fs"

import {MODE_STATUS} from "../constants"

const theme = {
    backgroundColor: "black",
    primaryTextColor: "white",
    disabledColor: "grey",
    secondaryTextColor: "grey",
    specialTextColor: "blue",
    fontBase: "10px"
};

const AppContainer = styled.div`
    background-color: ${props => props.theme.backgroundColor};
    width: 100%;
    height: 100%;
    overflow: scroll;
    color: ${props => props.theme.primaryTextColor};
    font-size: ${props => props.theme.fontBase};
    padding: 0 30px;
    & > * {
        margin: auto;
        max-width: 400px;
        min-width: 400px;
    }

    transition: all 0.5s;
    user-select: none;

    &  *.half-opacity {
        opacity: 0.5;
    }

    & *.invisible {
        visibility: hidden;
    }

`;



const modeReducer = (state, event) => {
    switch(event.type) {
        case "EDIT":
            return {
                ...state,
                editIndex: event.editIndex != null ? event.editIndex : 0,
                data: event.data || {},
                status: MODE_STATUS.EDIT,
            }
        case "CREATE":
            return {
                ...state,
                data: event.data || {},
                status: MODE_STATUS.CREATE,
            }
        case "SELECT":
            return {
                ...state,
                selectedIndexes: event.selectedIndexes || new Set(),
                status: MODE_STATUS.SELECT,
            }
        case "IDLE":
            return {
                ...state,
                data: {},
                selectedIndexes: new Set(),
                editIndex: null,
                status: MODE_STATUS.IDLE,
            }
        default:
            return {
                ...state,
                status: MODE_STATUS.IDLE,
            }
    }
};

const ModeInitialState = {
    data: {},
    selectedIndexes: new Set(),
    editIndex: null,
    status: MODE_STATUS.IDLE
};


export default (props) => {

    const contactsRepository = new ContactsRepository();

    const [contacts, setContacts] = useState([]);

    const [searchQuery, setSearchQuery] = useState( String() );
    const [modeState, modeDispatch] = useReducer(modeReducer, ModeInitialState);


    const SearchContextValue = {
        searchQuery,
        setSearchQuery
    };

    //Прикрутить сюда репозиторий и готово
    //UPD: я блять реально не понимаю почему .save -> setContacts(.getAll) не работает
    const ContactsContextValue = {
        contacts: contacts,
        addOne: async (data) => {
            
            const newState = [...contacts, {...data, index: contacts.length}]

            await contactsRepository.replace(newState);

            const res = await contactsRepository.getAll();

            setContacts(res);

        },
        removeByIdx: async (idx) => {

            if (idx < 0 || idx >= contacts.length)
                throw "index out of bounds";

            let newState = [];
            let contact;
            for (let i = 0; i < idx; i++) {
                contact = contacts[i];
                newState.push( {...contact} );
            }
            for (let i = idx + 1; i < contacts.length; i++) {
                contact = contacts[i];
                newState.push( {...contact, index: contact.index - 1} );
            }

            await contactsRepository.replace(newState);
            const res = await contactsRepository.getAll();
            setContacts(res);

        },
        updateByIdx: async (idx, data) => {

            let newState = [...contacts];

            newState[idx] = {...data, index: idx}

            await contactsRepository.replace(newState);
            const res = await contactsRepository.getAll();
            setContacts(res);

        },
    };

    const ModeContextValue = {
        setEdit: (editIndex, contact) => {
            const data = contact || ContactsContextValue.contacts[editIndex];
            modeDispatch({type: "EDIT", editIndex: editIndex, data});

        },
        setCreate: (contact) => modeDispatch({type: "CREATE", data: contact}),
        setIdle: () => modeDispatch({type: "IDLE"}),
        setSelect: (selectedIndexes) => modeDispatch({type: "SELECT", selectedIndexes}),
        exportContacts: (contacts) => {

            let options = {
                //Placeholder 1
                title: "Export sum sh1t",
                
                //Placeholder 2
                defaultPath : `${os.homedir()}/export.txt`,
                
                //Placeholder 4
                buttonLabel : "Export",
                
                //Placeholder 3
                filters :[
                 {name: 'Text file', extensions: ['txt']},

                ]
            }

            const savePath = dialog.showSaveDialogSync(options);
            
            const data = contacts.map(x => `${x.number}${':'}${x.name}`).join(os.EOL);

            fs.writeFileSync(savePath, data);
              
        },

        importContacts: async () => {
            let options = {
                //Placeholder 1
                title: "Import sum sh1t",
                
                //Placeholder 2
                defaultPath : os.homedir(),
                
                //Placeholder 4
                buttonLabel : "Import",
                
                //Placeholder 3
                filters :[
                 {name: 'Text file', extensions: ['txt']},

                ]
            }

            const importPath = dialog.showOpenDialogSync(options)[0];


            if (!fs.existsSync(importPath))
                throw "hz";

            const imContacts = fs.readFileSync(importPath)
                                .toString()
                                .split(os.EOL)
                                .map((line) => {
                                    const idx = line.indexOf(":");
                                    return (idx == -1) ? null : {number: line.slice(0, idx), name: line.slice(idx + 1)};
                                })
                                //Можно добавить RegEx
                                .filter(x => x !== null);
            
            contactsRepository.replace([...contacts, ...imContacts]);

            const res = await contactsRepository.getAll();
            setContacts(res);
                                
            


        },
        selectedIndexes: modeState.selectedIndexes,
        editIndex: modeState.editIndex,
        data: modeState.data,
        status: modeState.status,
    }


    

    useEffect(() => {

        (async () => {
            const data = ( await contactsRepository.getAll() );
            
            setContacts(data);

        })()

    }, []);



    return (
        <ThemeProvider theme={theme}>
        <ContactsContext.Provider value={ContactsContextValue}>
        <SearchContext.Provider value={SearchContextValue}>
        <ModeContext.Provider value={ModeContextValue}>

            <AppContainer>
                <Header/>
                <Contacts/>
            </AppContainer>


        </ModeContext.Provider>
        </SearchContext.Provider>
        </ContactsContext.Provider>
        </ThemeProvider>
    )
}