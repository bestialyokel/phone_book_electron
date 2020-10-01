import React, { useState } from 'react'
import styled from 'styled-components'

import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'

import data from "../data/repository"

export default (props) => {
    return data.map(x => {
        return (<div>{x.name + x.number}</div>)
    })
}