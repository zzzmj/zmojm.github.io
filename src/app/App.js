import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'

const Admin = loadable(() => import('../feature/admin/Admin'))
const ShenLun = loadable(() => import('../feature/shenlun'))
const Book = loadable(() => import('../feature/book/Book'))
const BookList = loadable(() => import('../feature/book/BookList'))
const Calc2 = loadable(() => import('../feature/calc/Calc2'))
const Test = loadable(() => import('./test'))
const WrongQuestion = loadable(() =>
    import('../feature/wrongQuestion/WrongQuestion')
)
const XingCe = loadable(() => import('../feature/xingce/XingCe'))
const XingCeList = loadable(() => import('../feature/xingce/XingCeList'))
const Exam = loadable(() => import('../feature/xingce/Exam'))
const CalcPdf = loadable(() => import('../feature/calc/CalcPdf'))
const EditCompoent = loadable(() => import('../feature/edit/Edit'))
const Idiom = loadable(() => import('../feature/idiom'))
import './App.scss'

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path='/' component={Admin} />
                <Route exact path='/admin' component={Admin} />
                <Route exact path='/shenlun' component={ShenLun} />
                <Route exact path='/edit/:objectId' component={EditCompoent} />
                {/* <Route exact path='/algorithm' component={Algorithm} /> */}
                {/* <Route exact path='/calc' component={Calc} /> */}
                <Route exact path='/calc' component={Calc2} />
                <Route exact path='/calcPdf' component={CalcPdf} />
                <Route exact path='/test' component={Test} />
                <Route exact path='/book' component={Book} />
                <Route exact path='/book/:objectId' component={BookList} />
                <Route exact path='/question' component={WrongQuestion} />
                {/* 这两个是打印模式 */}
                <Route exact path='/XingCe' component={XingCe} />
                <Route exact path='/XingCe/:objectId' component={XingCeList} />
                {/* 考试模式，提高能力 */}
                <Route exact path='/exam' component={Exam} />
                <Route exact path='/idiom' component={Idiom} />
            </Switch>
        </HashRouter>
    )
}

export default App
