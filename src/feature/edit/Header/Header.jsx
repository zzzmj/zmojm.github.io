import React from 'react'
import classNames from 'classnames'
import { ReactComponent as Logo } from '../../../static/logo.svg'
import { Button } from 'antd'
import './Header.scss'
import { useState } from 'react'
import EditCategoryModal from './EditCategoryModal'

const Header = props => {
    const { className, type = 'edit' } = props
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const prefix = 'zz-header'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })
    const handleOk = () => {
        setIsModalVisible(false)
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
            {type === 'edit' && (
                <div className='right'>
                    <Button loading={loading} type='outline-secondary'>
                        保存记录
                    </Button>

                    <Button
                        style={{ marginLeft: 30 }}
                        onClick={() => setIsModalVisible(true)}
                        type='outline-secondary'
                    >
                        编辑配置
                    </Button>
                </div>
            )}

            <EditCategoryModal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default Header
