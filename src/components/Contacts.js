import React, { useContext, useEffect, useState } from 'react'

import styled from "styled-components"

import ContactsContext from "../context/ContactsContext"


export default (props) => {
    const contactsCtx = useContext(ContactsContext);

    return contactsCtx.contacts.map(x => (<div>{x.name}</div>))
}