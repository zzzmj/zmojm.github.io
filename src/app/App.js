import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Header from '../feature/edit/Header/Header'
import Annotation from '../feature/edit/Annotation/Annotation'
import Comment from '../feature/edit/Comment/Comment'
import Highlighter from 'web-highlighter'
import './App.scss'
import Admin from '../feature/admin/Admin'
import Algorithm from '../feature/algorithm/Algorithm'
import Calc from '../feature/calc/Calc'

const Edit = () => {
    const highlighter = new Highlighter({
        exceptSelectors: ['.ant-list-item'],
    })
    return (
        <div className='yryr-home'>
            <Header />
            <div className='main'>
                <Annotation highlighter={highlighter} />
                <Comment highlighter={highlighter} />
            </div>
        </div>
    )
}

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/' component={Admin} />
                <Route exact path='/admin' component={Admin} />
                <Route exact path='/edit/:objectId' component={Edit} />
                <Route exact path='/algorithm' component={Algorithm} />
                <Route exact path='/calc' component={Calc} />
                {/* <Route path='/result' component={Result} /> */}
            </Switch>
        </HashRouter>
    )
}

export default App
