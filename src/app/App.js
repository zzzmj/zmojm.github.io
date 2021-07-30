import React from 'react'
import Header from '../feature/Header/Header'
import SideBar from '../feature/SideBar/SideBar'
import Annotation from '../feature/Annotation/Annotation'
import Highlighter from 'web-highlighter'
import Comment from '../feature/Comment/Comment'
import './App.scss'

function App() {
    const highlighter = new Highlighter()

    return (
        <div className='App'>
            <Header />
            <div className='main'>
                <SideBar />
                <Annotation highlighter={highlighter} />
                <Comment highlighter={highlighter} />
            </div>
        </div>
    )
}

export default App
