import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'
import './index.css'
import { store } from './store'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
