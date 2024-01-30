import {
    Collapse,
    Row,
    Col,
    Input,
    Select,
    Tooltip,
    Typography,
    InputNumber,
    Button,
} from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import './SideBar.scss'

const { Panel } = Collapse
const { Option } = Select
const { Title } = Typography

const SideBar = props => {
    const { onChange } = props
    const [config, setConfig] = useState({
        type: 'png',
        quality: '100',
    })
    const [cutConfig, setCutConfig] = useState({
        row: '',
        col: '',
    })
    const [activityKey, setActivityKey] = useState('')

    const clsPrefix = 'web-ps'

    // 改变导出文件格式
    const handleSelectConfig = (value, type) => {
        setConfig({
            ...config,
            [type]: value,
        })
    }

    const handleCutConfig = (type, value) => {
        setCutConfig({
            ...cutConfig,
            [type]: value,
        })
    }

    const handleSubmit = () => {
        onChange &&
            onChange({
                cutConfig,
            })
    }

    return (
        <div className={`${clsPrefix}-side-bar`}>
            <Title level={5}>自动划分选区</Title>
            <div className='row-col'>
                <span>行：</span>
                <InputNumber onChange={v => handleCutConfig('row', v)} />
                <span>列：</span>
                <InputNumber onChange={v => handleCutConfig('col', v)} />
                <Button onClick={handleSubmit}>应用</Button>
            </div>
            <Collapse
                activityKey={activityKey}
                className={`${clsPrefix}-collapse`}
                accordion
                expandIconPosition='right'
                ghost
            >
                <Panel
                    className={`${clsPrefix}-collapse-panel`}
                    header='自动划分选区'
                ></Panel>
                <Panel
                    className={`${clsPrefix}-collapse-panel`}
                    header='导出文件格式'
                >
                    <h3>
                        <strong>文件类型</strong>
                    </h3>
                    <Select
                        onChange={value => handleSelectConfig(value, 'type')}
                        className='select panel-item'
                        defaultValue={config.type}
                    >
                        <Option value='png'>PNG</Option>
                        <Option value='jpeg'>JPG/JPEG</Option>
                        <Option value='webp'>WEBP</Option>
                    </Select>

                    <Select
                        onChange={value => handleSelectConfig(value, 'quality')}
                        className='select panel-item'
                        defaultValue={config.quality}
                        optionLabelProp='label'
                    >
                        <Option label='100%（无压缩）' value='100'>
                            100%（无压缩）
                        </Option>
                        <Option label='80%' value='80'>
                            80%
                        </Option>
                        <Option label='70%' value='70'>
                            70%
                        </Option>
                        <Option label='50%（普通压缩）' value='50'>
                            50%（普通压缩）
                        </Option>
                        <Option label='20%' value='20'>
                            20%
                        </Option>
                    </Select>

                    <div
                        // onClick={handleClick}
                        className={`${clsPrefix}-header-download primary-button panel-item`}
                    >
                        下载
                    </div>
                </Panel>
            </Collapse>
        </div>
    )
}

export default SideBar
