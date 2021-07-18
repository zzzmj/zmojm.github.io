import React from 'react'
import Button from '../../components/Button/Button'
import classNames from 'classnames'
import './SideBar.scss'

const articleList = [
    {
        id: 'xx',
        name: '文章的标题哦',
    },
    {
        id: 'xx',
        name: '文章的标题哦',
    },
    {
        id: 'xx',
        name: '文章的标题哦',
    },
    {
        id: 'xx',
        name: '文章的标题哦',
    },
]

// 侧边栏
const SideBar = props => {
    const { className } = props

    const prefix = 'zz-sidebar'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    const handleUpload = () => {
        console.log('123')
    }

    return (
        <div className={cls}>
            <div className={`${prefix}-header`}>
                <div className='title'>全部文章</div>
                <div className='add'>
                    <Button type='secondary' onClick={handleUpload}>
                        上传文章
                    </Button>
                </div>
            </div>
            <div className={`${prefix}-input`}>
                <div className='input-group mb-3'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby='button-addon2'
                    />
                    <div className='input-group-append'>
                        <Button type='secondary'>筛选</Button>
                    </div>
                </div>
            </div>
            <ul className={`${prefix}-list list-group`}>
                {articleList.map((item, index) => {
                    const { name } = item
                    const btnCls = classNames({
                        'list-group-item': true,
                    })
                    return (
                        <Button key={index} className={btnCls}>
                            {name}
                        </Button>
                    )
                })}
            </ul>
        </div>
    )
}

export default SideBar
