// 画板库

import React, { useEffect, useRef } from 'react'
import {
    DeleteOutlined,
    CloseOutlined,
    UndoOutlined,
    RedoOutlined,
} from '@ant-design/icons'
// import SketchMain from './SketchMain'
import GuaFabric from './GuaFabric'
import './Sketch.scss'

function Sketch(props) {
    const canvasRef = useRef(null)
    const fabricObj = useRef(null)

    useEffect(() => {
        const f = new GuaFabric(canvasRef.current)
        fabricObj.current = f
    }, [])

    const handleClear = () => {
        const f = fabricObj.current
        f.clear()
    }

    const handleClose = () => {
        props.onClose && props.onClose()
    }
    const handleUndo = () => {
        const f = fabricObj.current
        f.undo()
    }
    const handleRedo = () => {
        const f = fabricObj.current
        f.redo()
    }

    return (
        <div className='mj-sketch'>
            <div className='control-panel'>
                <CloseOutlined
                    onClick={handleClose}
                    className='icon'
                    style={{
                        color: '#fff',
                        fontSize: 24,
                    }}
                />
                <UndoOutlined
                    onClick={handleUndo}
                    className='icon'
                    style={{
                        color: '#fff',
                        fontSize: 24,
                    }}
                />
                <RedoOutlined
                    onClick={handleRedo}
                    className='icon'
                    style={{
                        color: '#fff',
                        fontSize: 24,
                    }}
                />
                <DeleteOutlined
                    onClick={handleClear}
                    className='icon'
                    style={{
                        color: '#fff',
                        fontSize: 24,
                    }}
                />
                {/* <button onClick={handleClear}>清空画布</button>
                <button onClick={handleUndo}>撤销</button>
                <button onClick={handleRedo}>重做</button>
                <button onClick={handleClose}>关闭</button> */}
            </div>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}

export default Sketch
