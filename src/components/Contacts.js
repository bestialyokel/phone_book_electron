import React, { useContext, useEffect, useRef, useState } from 'react'

import styled from "styled-components"
import { MODE_STATUS } from '../constants';

import ContactsContext from "../context/ContactsContext"
import SearchContext from "../context/SearchContext"
import ModeContext from "../context/ModeContext"



const LetterGroup = styled.dl`
    margin: 0;
    padding: 0 0 0 0;
`;

const LetterLine = styled.dt`
    background: #B8C1C8;
    border-bottom: 1px solid #989EA4;
    border-top: 1px solid #717D85;
    color: black;
    font: bold 18px/21px Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 2px 0 0 12px;
    position: -webkit-sticky;
    position: sticky;
    top: -5px;
    opacity: 1;
    z-index: 100;
`;

const ContactLine = styled.dd`
    font: bold 20px/45px Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0 0 0 12px;
    white-space: nowrap;
    display :flex;
    position: relative;
    justify-content: space-between;
    padding-right: 5px;


    &:hover {
        transform: translate(0, -1px);
    }

    &.unselected {
        opacity: 0.3;
    }


`;

const ContactsContainer = styled.div`
    padding-top: 20px;
`;

const FormContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 0 20px 0px;
`;

const FormInput = styled.input`
    width: 180px;
    height: 40px;

    border-radius: 5px;

    background-color: black;

    color: white;

    &::placeholder {
        color: inherit;
    }

    text-indent: 10px;

    font-size: 1.2rem;

    outline: none;
    border: none;
`;

const ContactControlsWrapper = styled.div`
    position: absolute;

    opacity: 0;

    @keyframes opacityOn {
        0% {
            opacity: 0;
        }
        25% {
            opacity: 0.25
        }
        50% {
            opacity: 0.5
        }
        75% {
            opacity: 0.75
        }
        100% {
            opacity: 1;
        }
    };



    &:hover {
        animation: opacityOn 0.2s normal forwards step-end;
    }
    
    &.edit {
        animation: none;
        opacity: 1 !important;
    }

    display: flex;
    align-items: center;
    justify-content: space-evenly;

    

    width: 50px;
    font-size: 0.5rem;
    height: 30px;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
`;

const ContactControl = styled.button`
    border: none;
    outline: none;
    padding: 0;
    margin: 0;

    margin-left: 10px;

    background-color: inherit;
    color: ${props => props.theme.primaryTextColor};
    font-size: 1.5rem;
    font-weight: 600;

    padding: 0px 5px;

    outline: 1px solid white;

    cursor: pointer;

    &:active {
        color: red;
    }

    &:disabled {
        opacity: 0.65;
        cursor: default;
    }

    &:focus {
        color: blue;
    } 
`;

const EditInput = styled.input`
    width: 180px;
    height: 25px;

    margin: 10px 0px;

    background-color: black;

    border: none;

    border-radius: 10px;


    font: bold 1.3rem Helvetica, Arial, sans-serif;

    color: white;

    text-indent: 10px;


    outline: none;
`;


export default (props) => {

    const contactsCtx = useContext(ContactsContext);
    const searchCtx = useContext(SearchContext);
    const modeCtx = useContext(ModeContext);


    const filteredContacts = contactsCtx.contacts.filter(contact => {
        if (!searchCtx.searchQuery)
            return true;

        const name = contact.name.toLowerCase();
        const number = contact.number.toLowerCase();
        const query = searchCtx.searchQuery.toLowerCase();

        if (name.indexOf(query) != -1 || number.indexOf(query) != -1 )
            return true;

        return false;

    }).sort((a, b) => a.name.localeCompare(b.name));

    let letterMap = new Map();

    filteredContacts.forEach(contact => {
        const {name, number} = contact;
        const firstLetter = name[0].toLowerCase();
        if (!letterMap.has( firstLetter )) {
            letterMap.set(firstLetter, [ contact ]);
        } else {
            letterMap.set(firstLetter, [...letterMap.get(firstLetter), contact]);
        }
    
    });

    const setSelected = (contact) => {


        const setCopy = new Set(modeCtx.selectedIndexes);
        setCopy.has(contact.index) 
            ? setCopy.delete(contact.index) 
            : setCopy.add(contact.index);

        modeCtx.setSelect(setCopy);
    }

    const handleContactClickHOF = () => {

        if (modeCtx.status == MODE_STATUS.SELECT)
            return setSelected;

        
        return () => {}
    }

    const isUnSelected = (contact) => {
        
        if (modeCtx.status == MODE_STATUS.SELECT && !modeCtx.selectedIndexes.has(contact.index))
            return true;

        if (modeCtx.status == MODE_STATUS.EDIT && modeCtx.editIndex != contact.index)
            return true;

        return false;
    };



    return (
        <ContactsContainer>
            {modeCtx.status == MODE_STATUS.CREATE
                && <FormContainer>
                        <FormInput 
                            values={modeCtx.data.name} 
                            onChange={(evt) => modeCtx.setCreate({...modeCtx.data, name: evt.target.value})} 
                            placeholder="Имя">
                        </FormInput>
                        <FormInput 
                            values={modeCtx.data.number} 
                            onChange={(evt) => modeCtx.setCreate({...modeCtx.data, number: evt.target.value})} 
                            placeholder="Номер">
                        </FormInput>
                    </FormContainer>
            }
            {Array.from( letterMap.keys() )
                .map((letter) => {
                    return (
                        <LetterGroup key={letter}>
                            <LetterLine>
                                {letter.toUpperCase()}
                            </LetterLine>
                            {letterMap.get(letter).map((contact, i) => {
                                return (
                                        <ContactLine 
                                            className={isUnSelected(contact) && 'unselected'} 
                                            key={i} 
                                            onClick={(evt) => handleContactClickHOF()(contact) }
                                        >
                                            {
                                                modeCtx.status == MODE_STATUS.EDIT && modeCtx.editIndex == contact.index
                                                ?
                                                    <>
                                                        <EditInput
                                                            placeholder="Имя"
                                                            value={modeCtx.data.name}
                                                            onChange={(evt) => modeCtx.setEdit(modeCtx.editIndex, {...modeCtx.data, name: evt.target.value}) }
                                                        />
                                                        <EditInput
                                                            placeholder="Номер"
                                                            value={modeCtx.data.number}
                                                            onChange={(evt) => modeCtx.setEdit(modeCtx.editIndex, {...modeCtx.data, number: evt.target.value}) }
                                                        />    
                                                    </>
                                                :
                                                    <>
                                                        <span>{contact.name}</span>
                                                        <span>{contact.number}</span>
                                                    </>
                                            }
                                            {
                                                modeCtx.status == MODE_STATUS.IDLE
                                                &&
                                                    <ContactControlsWrapper
                                                        className={'' /* modeCtx.status != MODE_STATUS.IDLE && 'invisible' */}
                                                        onClick={() => {}}
                                                    >
                                                        <ContactControl
                                                            onClick={(evt) => {
                                                                evt.stopPropagation();
                                                                modeCtx.setEdit(contact.index);
                                                            }}
                                                        >
                                                            {"U"}
                                                        </ContactControl>
                                                        <ContactControl
                                                            onClick={(evt) => {
                                                                evt.stopPropagation();
                                                                contactsCtx.removeByIdx(contact.index);
                                                            }}
                                                        >
                                                            {"D"}
                                                        </ContactControl>
                                                    </ContactControlsWrapper>
                                            }
                                            {
                                                modeCtx.status == MODE_STATUS.EDIT && contact.index == modeCtx.editIndex
                                                && 
                                                    <ContactControlsWrapper
                                                        className={'edit' /* modeCtx.status != MODE_STATUS.IDLE && 'invisible' */}
                                                        onClick={() => {}}
                                                    >
                                                        {
                                                            modeCtx.status == MODE_STATUS.EDIT
                                                            &&
                                                                <ContactControl
                                                                    onClick={(evt) => {
                                                                        evt.stopPropagation();
                                                                        contactsCtx.updateByIdx(modeCtx.editIndex, modeCtx.data);
                                                                        modeCtx.setIdle();
                                                                    }}
                                                                >
                                                                    {"E"}
                                                                </ContactControl>
                                                        }
                                                    </ContactControlsWrapper>
                                            }
                                        </ContactLine>
                                )
                            })}
                        </LetterGroup>
                    )
                })
            }
        </ContactsContainer>
    );
}