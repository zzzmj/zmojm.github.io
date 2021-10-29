import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'
import Graph from './graph'
import { Radio } from 'antd'
import 'antd/dist/antd.css'
import AdjacencyMatrixGraph from './AdjacencyMatrixGraph'
// const graph = new Graph();
const limitData = [
    { skuId: 1, list: ['4L', '黑色', '128G'] },
    { skuId: 2, list: ['4L', '红色', '256G'] },
    { skuId: 3, list: ['1L', '黑色', '128G'] },
    { skuId: 4, list: ['1L', '黑色', '256G'] },
]
const commoditySpecs = [
    { title: '尺寸', key: 'size', list: ['4L', '1L'] },
    { title: '颜色', key: 'color', list: ['黑色', '红色'] },
    { title: '体重', key: 'weight', list: ['128G', '256G'] },
]

const adjGraph = new AdjacencyMatrixGraph()
adjGraph.loadDataSource(commoditySpecs, limitData)

console.log('adj', adjGraph.toString())

// 呵呵。
function Matrix() {
    const [data, setData] = useState({})
    const graph = useMemo(() => {
        const g = new Graph()
        g.loadDataSource(commoditySpecs, limitData)
        console.log('g.tostring', g.toString())
        return g
    }, [])
    const [limit, setLimit] = useState(graph.getVertices())

    useEffect(() => {
        // 获取选中的顶点
        const vertexList = Object.keys(data)
            .map(key => data[key])
            .filter(key => key)
        const l = graph.getIntersection(vertexList)
        setLimit(l)
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
                                    !limit.includes(item) ||
                                    graph.adjList.get(item).length <= 0
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
