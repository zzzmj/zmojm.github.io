import React from 'react'
import { useRoutes, HashRouter } from 'react-router-dom'
import routes from '../router'
import './App.scss'

const RouterConfig = () => {
    const Element = useRoutes(routes)
    return Element
}

const App = () => {
    return (
        <HashRouter>
            <RouterConfig />
        </HashRouter>
    )
}

export default App
