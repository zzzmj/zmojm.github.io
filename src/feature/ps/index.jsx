import React, { useState } from 'react'
import Cropper from './components/Cropper/index'
import Header from './components/Header'
import SideBar from './components/SideBar'
import './index.scss'

const Ps = () => {
    const [lineCofig, setLineConfig] = useState({
        row: '',
        col: '',
    })
    const handleSibeBarConfig = config => {
        const { cutConfig } = config
        setLineConfig({
            ...cutConfig,
        })
    }
    console.log('line', lineCofig)
    return (
        <div className='web-ps'>
            <Header />
            <div className='main'>
                <SideBar onChange={handleSibeBarConfig} />
                <Cropper lineConfig={lineCofig} />
            </div>
        </div>
    )
}

export default Ps
