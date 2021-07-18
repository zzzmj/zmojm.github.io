import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import './index.css'
import './custom.scss'

window.log = console.log.bind(console)
console.log('执行')
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
