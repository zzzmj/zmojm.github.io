import React from 'react'
import { useRoutes, BrowserRouter } from 'react-router-dom'
import routes from '../router'
import './App.scss'

const RouterConfig = () => {
    const Element = useRoutes(routes)
    return Element
}

const App = () => {
    return (
        <BrowserRouter>
            <RouterConfig />
        </BrowserRouter>
    )
}

export default App
