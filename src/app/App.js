import React from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import Header from '../feature/edit/Header/Header'
import SideBar from '../feature/edit/SideBar/SideBar'
import Annotation from '../feature/edit/Annotation/Annotation'
import Comment from '../feature/edit/Comment/Comment'
import Highlighter from 'web-highlighter'
import './App.scss'
import ArticleTable from '../feature/admin/ArticleTable/ArticleTable'
import Algorithm from '../feature/algorithm/Algorithm'
import Calc from '../feature/calc/Calc'

const Edit = () => {
    const highlighter = new Highlighter()

    return (
        <div className='yryr-home'>
            <Header />
            <div className='main'>
                <SideBar />
                <Annotation highlighter={highlighter} />
                <Comment highlighter={highlighter} />
            </div>
        </div>
    )
}

const Admin = () => {
    return (
        <div className='yryr-admin'>
            <Header type='admin' />
            <div className='main'>
                <ArticleTable />
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
