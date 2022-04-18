import React, { useEffect, useState } from 'react'
import { HashRouter, Route, Switch, useParams } from 'react-router-dom'
import Header from '../feature/edit/Header/Header'
import Annotation from '../feature/edit/Annotation/Annotation'
import Comment from '../feature/edit/Comment/Comment'
import Highlighter from 'web-highlighter'
import Admin from '../feature/admin/Admin'
import Book from '../feature/book/Book'
import BookList from '../feature/book/BookList'
import Algorithm from '../feature/algorithm/Algorithm'
import Calc from '../feature/calc/Calc'
import Calc2 from '../feature/calc/Calc2'
import Test from './test'
import WrongQuestion from '../feature/wrongQuestion/WrongQuestion'
import './App.scss'
import XingCe from '../feature/xingce/XingCe'
import XingCeList from '../feature/xingce/XingCeList'
import Exam from '../feature/xingce/Exam'

const Edit = () => {
    const params = useParams()
    const [highlighter, setHighlighter] = useState(
        new Highlighter({
            exceptSelectors: ['.ant-list-item'],
        })
    )
    useEffect(() => {
        const h = new Highlighter({
            exceptSelectors: ['.ant-list-item'],
        })
        setHighlighter(h)

        return () => {
            h.dispose()
        }
    }, [params])

    return (
        <div className='yryr-home'>
            <Header />
            <div className='main'>
                <Annotation key={highlighter} highlighter={highlighter} />
                <Comment key={highlighter} highlighter={highlighter} />
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
                <Route exact path='/calc2' component={Calc2} />
                <Route exact path='/test' component={Test} />
                <Route exact path='/book' component={Book} />
                <Route exact path='/book/:objectId' component={BookList} />
                <Route exact path='/question' component={WrongQuestion} />
                {/* 这两个是打印模式 */}
                <Route exact path='/XingCe' component={XingCe} />
                <Route exact path='/XingCe/:objectId' component={XingCeList} />
                {/* 考试模式，提高能力 */}
                <Route exact path='/exam' component={Exam} />
            </Switch>
        </HashRouter>
    )
}

export default App
