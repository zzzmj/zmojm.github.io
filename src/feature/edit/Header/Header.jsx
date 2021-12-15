import React, { useCallback, useEffect } from 'react'
import classNames from 'classnames'
import { ReactComponent as Logo } from '../../../static/logo.svg'
import { Button, message } from 'antd'
import './Header.scss'
import { useState } from 'react'
import EditCategoryModal from './EditCategoryModal'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { updateArticleToLeanCloud } from '../../../service/article'
import StatisticsModal from './StatisticsModal'

const Header = props => {
    const { className, type = 'edit' } = props
    const history = useHistory()
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isStatisticsVisible, setIsStatisticsVisible] = useState(false)
    const annotationList = useSelector(state => state.annotation.annotationList)
    const prefix = 'zz-header'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })
    const handleOk = useCallback(async () => {
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
    }, [annotationList])

    useEffect(() => {
        const keyDownFn = event => {
            const keyCode = event.keyCode

            if (keyCode == 83 && window.event.ctrlKey) {
                window.event.preventDefault()
                handleOk()
            }
        }
        window.addEventListener('keydown', keyDownFn)

        return () => {
            window.removeEventListener('keydown', keyDownFn)
        }
    }, [handleOk])

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleNavigate = () => {
        history.push({
            pathname: `/admin`,
        })
    }

    return (
        <div className={cls}>
            <div className='left'>
                <div className='logo' onClick={handleNavigate}>
                    <Logo />
                </div>
                <div className='title'>语料标注与统计系统</div>
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
                    <Button
                        style={{ marginLeft: 30 }}
                        type='outline-secondary'
                        onClick={() => setIsStatisticsVisible(true)}
                    >
                        统计分析
                    </Button>
                </div>
            )}
            {/* 配置编辑 */}
            <EditCategoryModal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            />
            {/* 统计分析 */}
            <StatisticsModal
                visible={isStatisticsVisible}
                onCancel={() => setIsStatisticsVisible(false)}
            />
        </div>
    )
}

export default Header
