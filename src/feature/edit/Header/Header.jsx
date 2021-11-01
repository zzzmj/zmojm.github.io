import React from 'react'
import classNames from 'classnames'
import { ReactComponent as Logo } from '../../../static/logo.svg'
import { Button, message } from 'antd'
import './Header.scss'
import { useState } from 'react'
import EditCategoryModal from './EditCategoryModal'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { updateArticleToLeanCloud } from '../../../service/article'

const Header = props => {
    const { className, type = 'edit' } = props
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const annotationList = useSelector(state => state.annotation.annotationList)
    const prefix = 'zz-header'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })
    const handleOk = async () => {
        const { objectId } = params
        console.log('annotationList', annotationList, objectId)
        setLoading(true)
        updateArticleToLeanCloud(objectId, {
            annotation: annotationList,
            annotationCount: annotationList.length || 0,
        })
            .then(res => {
                message.success('保存成功！')
                setLoading(false)
            })
            .catch(err => {
                message.success('保存失败，请检查网络设置！')
                setLoading(false)
            })
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
                    <Button
                        loading={loading}
                        type='outline-secondary'
                        onClick={handleOk}
                    >
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