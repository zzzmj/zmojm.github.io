import classNames from 'classnames'
import React from 'react'

function QuestionItem(props) {
    const { data, index, layout, className } = props
    const cls = classNames({
        [className]: className,
    })
    const handleSelectOption = (data, pos) => {
        props.onClick && props.onClick(data, pos)
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
                            const mapIndexToLetter = ['A', 'B', 'C', 'D']
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
            </div>
        </div>
    )
}

export default QuestionItem
