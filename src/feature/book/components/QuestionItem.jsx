import classNames from 'classnames'
import React, { useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import Sketch from '../../../components/Sketch/Sketch'
import './QuestionItem.scss'

function QuestionItem(props) {
    const { data, index, layout, className, status } = props
    const [sketchVisible, setSketchVisible] = useState(false)

    const cls = classNames({
        question: true,
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
            <span>{index + 1}.</span>
            <div className='content'>
                <div className='title'>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: data.content,
                        }}
                    ></span>
                </div>

                <div className={`options ${layout}`}>
                    {data.accessories[0] &&
                        data.accessories[0].options.map((option, pos) => {
                            const mapIndexToLetter = [
                                'A',
                                'B',
                                'C',
                                'D',
                                'E',
                                'F',
                                'G',
                                'H',
                            ]
                            let status =
                                pos == data.selectIndex &&
                                data.status == 'correct'
                                    ? 'correct'
                                    : 'wrong'
                            const optionCls = classNames({
                                option: true,
                                [status]: pos === data.selectIndex,
                            })
                            return (
                                <div
                                    key={pos}
                                    onClick={() =>
                                        handleSelectOption(data, pos)
                                    }
                                    className={optionCls}
                                >
                                    <span className='num'>
                                        {mapIndexToLetter[pos]}.
                                    </span>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: option,
                                        }}
                                    ></span>
                                </div>
                            )
                        })}
                </div>
                <EditOutlined
                    className='edit-icon'
                    onClick={handleClickEdit}
                    style={{ fontSize: 22, color: '#a2a9be' }}
                />
            </div>
            {sketchVisible && <Sketch onClose={handleClose} />}
        </div>
    )
}

export default QuestionItem
