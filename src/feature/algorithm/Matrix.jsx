import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'
import Graph from './graph'
import { Radio } from 'antd'
import 'antd/dist/antd.css'
import AdjacencyMatrixGraph from './AdjacencyMatrixGraph'
import AdjacencyListGraph from './AdjacencyListGraph'
const limitData = [
    { skuId: 1, list: ['意外险', '十年', '0岁到18岁'] },
    { skuId: 2, list: ['意外险', '一百年', '0岁到18岁'] },
    { skuId: 3, list: ['车险', '十年', '0岁到18岁'] },
    { skuId: 4, list: ['车险', '十年', '19岁到60岁'] },
    { skuId: 5, list: ['健康险', '一千年', '61岁到100岁'] },
    { skuId: 6, list: ['健康险', '一千年', '0岁到18岁'] },
    { skuId: 7, list: ['健康险', '十年', '19岁到60岁'] },
]
const commoditySpecs = [
    {
        title: '保险种类',
        key: 'type',
        list: ['意外险', '车险', '健康险'],
    },
    {
        title: '保障时间',
        key: 'time',
        list: ['十年', '一百年', '一千年'],
    },
    {
        title: '投保人年龄',
        key: 'age',
        list: ['0岁到18岁', '19岁到60岁', '61岁到100岁'],
    },
]
// const limitData = [
//     { skuId: 1, list: ['4L', '黑色', '128G'] },
//     { skuId: 2, list: ['4L', '红色', '256G'] },
//     { skuId: 3, list: ['1L', '黑色', '128G'] },
//     { skuId: 4, list: ['1L', '黑色', '256G'] },
// ]
// const commoditySpecs = [
//     { title: '尺寸', key: 'size', list: ['4L', '1L'] },
//     { title: '颜色', key: 'color', list: ['黑色', '红色'] },
//     { title: '体重', key: 'weight', list: ['128G', '256G'] },
// ]
const g = new AdjacencyListGraph()
g.loadDataSource(commoditySpecs, limitData)

// 呵呵。
function Matrix() {
    const [data, setData] = useState({})
    const graph = useMemo(() => {
        const g = new AdjacencyMatrixGraph()
        g.loadDataSource(commoditySpecs, limitData)
        console.log('g.tostring', g.toString())
        // const g = new AdjacencyListGraph()
        // g.loadDataSource(commoditySpecs, limitData)
        return g
    }, [])
    const [limit, setLimit] = useState(graph.getExistVertices())

    useEffect(() => {
        // 获取选中的顶点
        const vertexList = Object.keys(data)
            .map(key => data[key])
            .filter(key => key)
        const l = graph.getIntersection(vertexList)
        console.log('intersection', l)
        if (l) {
            setLimit(l)
        }
    }, [data])

    const handleChange = (e, key) => {
        const value = e.target.value
        const newData = {
            ...data,
            [key]: value,
        }
        setData(newData)
    }

    const handleClick = key => {
        // setData
        setData({
            ...data,
            [key]: '',
        })
    }

    return (
        <div className='App'>
            {commoditySpecs.map((spec, index_i) => {
                const { title, key, list } = spec
                return (
                    <div key={index_i} className=''>
                        <div>{title}</div>
                        <Radio.Group
                            value={data[key]}
                            onChange={e => handleChange(e, key)}
                            buttonStyle='solid'
                        >
                            {list.map(item => {
                                // 没有item，或者为空
                                let disable = false
                                if (
                                    data[key] !== item &&
                                    !limit.includes(item)
                                ) {
                                    disable = true
                                }
                                return (
                                    <Radio.Button
                                        onClick={() => handleClick(key)}
                                        disabled={disable}
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </Radio.Button>
                                )
                            })}
                        </Radio.Group>
                    </div>
                )
            })}
        </div>
    )
}

export default Matrix
