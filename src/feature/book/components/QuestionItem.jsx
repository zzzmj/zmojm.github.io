import classNames from 'classnames'
import React, { useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import Sketch from '../../../components/Sketch/Sketch'
import './QuestionItem.scss'
import MaterialModal from './MaterialModal'
const cleanUpHtml = (html) => {
    const maxSpaces = 3; // 最多允许的空格数量
    const htmlWithSpaces = html.replace(/&nbsp;/gi, ' '); // 将&nbsp;转换为普通空格
    const spaceRegex = /(\s\s\s\s+)/g; // 匹配四个或更多连续空格
    return htmlWithSpaces.replace(spaceRegex, (match) => '&nbsp;&nbsp;'); // 限制为三个空格
};


function QuestionItem(props) {
    const { data, index, layout, className, status } = props
    const [sketchVisible, setSketchVisible] = useState(false)
    const [materialVisible, setMaterialVisible] = useState(false)

    const cls = classNames({
        // question: true,
        [className]: className,
        [status]: status,
    })
    const handleSelectOption = (data, pos) => {
        props.onClick && props.onClick(data, pos)
    }

    const handleClickEdit = () => {
        console.log('点击', sketchVisible)
        setSketchVisible(true)
    }

    const handleClose = () => {
        setSketchVisible(false)
    }
    
    return (
        <div className={cls}>
            {data.material && <div dangerouslySetInnerHTML={{ __html: cleanUpHtml(data.material.content) }} />}
            <div className='question'>
                <span>{index + 1}.</span>
                
                <div className='content'>
                    <div className='title'>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: `<div><div class="fl">${
                                    data?.source ? `（${data?.source?.slice(0, 7)}）` : ''
                                }</div>${data.content}</div>`,
                                // __html: data.content,
                            }}
                        ></span>
                    </div>
                    {/* {
                    data.material && !materialVisible && <div onClick={() => setMaterialVisible(true)} className='m-btn'>弹出材料</div>
                } */}
                    <div className={`options ${layout}`}>
                        {data?.accessories[0] &&
                            data?.accessories[0]?.options.map((option, pos) => {
                                const mapIndexToLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                                let status = pos == data.selectIndex && data?.status == 'correct' ? 'correct' : 'wrong'
                                const optionCls = classNames({
                                    option: true,
                                    [status]: pos === data.selectIndex,
                                })
                                // num在打印的时候显示data.source.slice(0, 3)
                                return (
                                    <div key={pos} onClick={() => handleSelectOption(data, pos)} className={optionCls}>
                                        <span className='num'>{mapIndexToLetter[pos]}.</span>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: option,
                                            }}
                                        ></span>
                                    </div>
                                )
                            })}
                    </div>
                    <EditOutlined className='edit-icon' onClick={handleClickEdit} style={{ fontSize: 22, color: '#a2a9be' }} />
                </div>
            </div>
            {sketchVisible && <Sketch onClose={handleClose} />}
            {materialVisible && <MaterialModal content={data?.material?.content} onClose={() => setMaterialVisible(false)} />}
        </div>
    )
}

export default QuestionItem