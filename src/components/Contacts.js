import React, { useContext, useEffect, useState } from 'react'

import styled from "styled-components"

import ContactsContext from "../context/ContactsContext"
import SearchContext from "../context/SearchContext"


export default (props) => {
    const contactsCtx = useContext(ContactsContext);
    const searchCtx = useContext(SearchContext);

    return contactsCtx.contacts.filter(contact => {
        if (!searchCtx.searchQuery)
            return true;

        const name = contact.name.toLowerCase();
        const number = contact.name.toLowerCase();
        const query = searchCtx.searchQuery.toLowerCase();

        if (name.indexOf(query) != -1 || number.indexOf(query) != -1 )
            return true;

        return false;
    }).map(x => (<div>{x.name + " " + x.number}</div>))
}