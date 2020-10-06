import React, { useEffect, useState } from 'react'

import styled, {keyframes} from "styled-components"


const AddButton = styled.button`
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    
    background-color: inherit;
    color: ${props => props.theme.specialTextColor};
    font-size: 2rem;


    &:active {
        outline: 1px solid red;
    }
`

const SearchBar = styled.input``

export default (props) => {
    return (
        <header>
            <div>
                <AddButton>+</AddButton>
            </div>
            <div>
                <h1>Контакты</h1>
            </div>
            <div>
                <SearchBar/>
            </div>
            <div>UserTipa</div>
        </header>
    )
}