import React, { useEffect, useState, useContext } from 'react'

import styled, {keyframes} from "styled-components"


import SearchContext from "../context/SearchContext"
import ModeContext from "../context/ModeContext"
import ContactsContext from "../context/ContactsContext"

import { MODE_STATUS } from '../constants'


const ControlButton = styled.button`
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    
    background-color: inherit;
    color: ${props => props.theme.primaryTextColor};
    font-size: 1.8rem;
    font-weight: 600;

    padding: 5px 10px;

    outline: 1px solid white;

    cursor: pointer;

    &:active {
        color: #AAAAAA;
    }

    &:disabled {
        opacity: 0.65;
        cursor: default;
    }

`

const ButtonWrapper = styled.div`
    text-align: right;
    padding-top: 25px;
    padding-right: 0px;
    display: flex;
    justify-content: space-around;
`

const TitleWrapper = styled.div`
    font-size 1.5rem;
    padding-top: 20px;
`

const SearchWrapper = styled.div`
    padding-top: 20px;
`

const SearchBar = styled.input`

    width: 100%;
    height: 40px;

    font-size: 1.3rem;
    
    text-indent: 0.6rem;

    border-radius: 8px;

    background-color: white;

    &:focus {
        outline: none;
    }

`

const Header = styled.header`


`



export default (props) => {

    const searchCtx = useContext(SearchContext);
    const modeCtx = useContext(ModeContext);
    const contactsCtx = useContext(ContactsContext);


    return (
        <Header>
            <ButtonWrapper>
                {modeCtx.status == MODE_STATUS.IDLE 
                    && <ControlButton onClick={async () => modeCtx.setCreate(modeCtx.data)}>{"Create"}</ControlButton> 
                }
                {modeCtx.status == MODE_STATUS.IDLE
                    && <ControlButton 
                            onClick={() => modeCtx.importContacts() }
                        >
                            {"Import"}
                        </ControlButton> 
                }

                {modeCtx.status == MODE_STATUS.CREATE 
                    && <ControlButton 
                            onClick={async () => {
                                await contactsCtx.addOne(modeCtx.data);
                                modeCtx.setIdle();
                            }}
                            disabled={!(modeCtx.data.name && modeCtx.data.number)}
                        >
                            {"Add"}
                        </ControlButton> 
                }
                {modeCtx.status == MODE_STATUS.IDLE 
                    && <ControlButton 
                            onClick={() => modeCtx.setSelect()}
                            disabled={contactsCtx.contacts.length == 0}
                        >
                            {"Select"}
                        </ControlButton>
                }
                {modeCtx.status == MODE_STATUS.SELECT 
                    && <ControlButton 
                            onClick={async () => {
                                const contacts = Array.from(modeCtx.selectedIndexes).map(index => contactsCtx.contacts[index]);

                                modeCtx.exportContacts(contacts);
                                
                            }}
                            disabled={modeCtx.selectedIndexes.size == 0}
                        >
                            {"Export"}
                        </ControlButton>
                }
                {modeCtx.status != MODE_STATUS.IDLE
                    && <ControlButton onClick={() => modeCtx.setIdle()}>
                            {"Cancel"}
                        </ControlButton> 
                }

            </ButtonWrapper>
            <TitleWrapper>
                <h1>Контакты</h1>
            </TitleWrapper>
            <SearchWrapper>
                    <SearchBar 
                        disabled={modeCtx.status != MODE_STATUS.IDLE}
                        className={modeCtx.status != MODE_STATUS.IDLE && 'half-opacity'}
                        value={searchCtx.searchQuery} 
                        onChange={(event) => searchCtx.setSearchQuery(event.target.value)}
                        placeholder="Поиск" 
                    />

            </SearchWrapper>
        </Header>
    )
}