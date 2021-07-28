import React from 'react'
import classNames from 'classnames'
import { ReactComponent as Logo } from '../../static/logo.svg'
import { Button } from 'antd'
import './Header.scss'
import { useState } from 'react'
import EditCategoryModal from './EditCategoryModal'

const Header = props => {
    const { className } = props
    const [isModalVisible, setIsModalVisible] = useState(false)
    const prefix = 'zz-header'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })
    const handleEdit = () => {
        setIsModalVisible(true)
    }
    const handleCancel = () => {
        setIsModalVisible(false)
    }

    return (
        <div className={cls}>
            <div className='left'>
                <div className='logo'>
                    <Logo />
                </div>
            </div>
            <div className='right'>
                <Button type='outline-secondary'>上传配置</Button>
                <Button onClick={handleEdit} type='outline-secondary'>
                    编辑配置
                </Button>
            </div>

            <EditCategoryModal
                visible={isModalVisible}
                onOk={handleEdit}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default Header
