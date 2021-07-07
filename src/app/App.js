import React from 'react'
import Header from '../feature/Header/Header'
import SideBar from '../feature/SideBar/SideBar'
import Annotation from '../feature/Annotation/Annotation'
import './App.scss'

function App() {
    return (
        <div className='App'>
            <Header />
            <div className='main'>
                <SideBar />
                <Annotation />
            </div>
        </div>
    )
}

export default App
