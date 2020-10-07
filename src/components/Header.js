import React, { useEffect, useState, useContext } from 'react'

import styled, {keyframes} from "styled-components"


import SearchContext from "../context/SearchContext"


const AddButton = styled.button`
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    
    background-color: inherit;
    color: ${props => props.theme.specialTextColor};
    font-size: 3rem;
    &:active {
        filter: invert(100%);
    }
`

const ButtonWrapper = styled.div`
    text-align: right;
    padding-top: 25px;
    padding-right: 0px;
`

const TitleWrapper = styled.div`
    font-size 1.5rem;
`

const SearchWrapper = styled.div`

`

const SearchBar = styled.input`

    width: 100%;
    height: 30px;
    
    text-indent: 8px;

    background-color: white;

    &:focus {
        outline: none;
    }
`

const Header = styled.header`

`

export default (props) => {

    const searchCtx = useContext(SearchContext);

    return (
        <Header>
            <ButtonWrapper>
                <AddButton>+</AddButton>
            </ButtonWrapper>
            <TitleWrapper>
                <h1>Контакты</h1>
            </TitleWrapper>
            <SearchWrapper>
                <SearchBar value={searchCtx.searchQuery} onChange={(event) => searchCtx.setSearchQuery(event.target.value)} placeholder="Поиск" />
            </SearchWrapper>
            <div>UserTipa</div>
        </Header>
    )
}