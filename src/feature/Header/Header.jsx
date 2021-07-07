import React from 'react'
import classNames from 'classnames'
import { ReactComponent as Logo } from '../../static/logo.svg'
import Button from '../../components/Button/Button'
import './Header.scss'

const Header = props => {
    const { className } = props

    const prefix = 'zz-header'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    return (
        <div className={cls}>
            <div className='left'>
                <div className='logo'>
                    <Logo />
                </div>
            </div>
            <div className='right'>
                <Button type='outline-secondary'>上传配置</Button>
            </div>
        </div>
    )
}

export default Header
