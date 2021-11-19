// adjacency matrix
/**
 *
[4L, 49,1,2]  -> [1L, 49,3,4]  [黑色, 14,1,3,4]  [128G, 77,1,3]  [红色, 14,2]  [256G, 77,2,4]  
[1L, 49,3,4]  -> [4L, 49,1,2]  [黑色, 14,1,3,4]  [128G, 77,1,3]  [256G, 77,2,4]  
[黑色, 14,1,3,4]  -> [红色, 14,2]  [4L, 49,1,2]  [128G, 77,1,3]  [1L, 49,3,4]  [256G, 77,2,4] 

{[1L, 49,3,4] [128G, 77,1,3] [红色, 14,2] [256G, 77,2,4]}
[红色, 14,2]  -> [黑色, 14,1,3,4]  [4L, 49,1,2]  [256G, 77,2,4]  
[128G, 77,1,3]  -> [256G, 77,2,4]  [4L, 49,1,2]  [黑色, 14,1,3,4]  [1L, 49,3,4]  
[256G, 77,2,4]  -> [128G, 77,1,3]  [4L, 49,1,2]  [红色, 14,2]  [1L, 49,3,4]  [黑色, 14,1,3,4]  
 */
class Vertex {
    constructor(id) {
        this.id = id
        this.sku = new Set()
    }
}
const log = console.log.bind(console, '[adj-list]')
// Adjacency table
class AdjacencyListGraph {
    constructor(isDirected = false) {
        this.vertices = [] //顶点 vertex的复数
        this.adjList = new Map() // 邻接表 Adjacency
        this.isDirected = isDirected // 是否为有向图
    }

    loadDataSource(commoditySpecs, limitData) {
        // 1. 通过规格添加顶点
        const vertex = commoditySpecs.reduce((acc, cur) => {
            return acc.concat(cur.list)
        }, [])
        vertex.forEach(id => {
            const vertex = new Vertex(id)
            this.addVertex(vertex)
        })
        // 2. 约束条件添加边
        // 同级可选
        for (let i = 0; i < commoditySpecs.length; i++) {
            const item = commoditySpecs[i].list
            for (let j = 0; j < item.length; j++) {
                for (let k = 0; k < item.length; k++) {
                    if (item[j] !== item[k]) {
                        this.addEdge(
                            item[j],
                            item[k],
                            parseInt(Math.random() * 100)
                        )
                    }
                }
            }
        }

        // 限制条件
        for (let i = 0; i < limitData.length; i++) {
            const item = limitData[i].list
            const skuId = limitData[i].skuId
            for (let j = 0; j < item.length; j++) {
                for (let k = 0; k < item.length; k++) {
                    if (item[j] !== item[k]) {
                        this.addEdge(item[j], item[k], skuId)
                    }
                }
            }
        }
    }

    getVertexById(vertexId) {
        const vertex = this.vertices.find(vertex => vertex.id === vertexId)
        return vertex
    }

    // 判断顶点是否存在
    hasVertex(vertex) {
        // const result = this.vertices.some(vertex => vertex.id === vertexId)
        return this.vertices.includes(vertex)
    }

    // 判断边是否存在
    hasEdge(v, w) {
        const result = this.adjList.get(v).includes(w)
        return result
    }

    // 添加顶点
    addVertex(vertex) {
        if (this.hasVertex(vertex)) return
        this.vertices.push(vertex)
        this.adjList.set(vertex, [])
    }

    // 建立v => w的边联系
    addEdge(vId, wId, skuId) {
        const v1 = this.getVertexById(vId)
        const v2 = this.getVertexById(wId)
        if (!v1 || !v2) {
            console.log('v, w节点不存在, 请先添加入节点中')
            return
        }
        if (!this.hasEdge(v1, v2)) {
            v1.sku.add(skuId)
            v2.sku.add(skuId)
            this.adjList.get(v1).push(v2)
            this.adjList.get(v2).push(v1)
        }
    }

    getVertices() {
        return this.vertices
    }

    getExistVertices() {
        return this.existVertices
    }

    getVertexIdList(vertexId) {
        if (vertexId) {
            const vertex = this.getVertexById(vertexId)
            const vertexList = this.adjList.get(vertex)
            return vertexList.map(item => item.id)
        }
        return this.vertices.map(item => item.id)
    }

    getAdjList() {
        return this.adjList
    }

    vertexToString(vertex) {
        return `[${vertex.id}, ${[...vertex.sku]}] `
    }

    toString() {
        let s = ''
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = this.vertices[i]
            s += `${this.vertexToString(vertex)} -> `
            const neighbors = this.adjList.get(this.vertices[i])
            for (let j = 0; j < neighbors.length; j++) {
                s += `${this.vertexToString(neighbors[j])} `
            }
            s += '\n'
        }
        return s
    }

    // 判断v1和v2是否连通
    find(v1, v2) {
        return this.adjList.get(v1).includes(v2)
    }

    getSkuIntersection(setList) {
        const map = new Map()
        for (let i = 0; i < setList.length; i++) {
            const sku = [...setList[i]]
            sku.forEach(item => {
                if (map.has(item)) {
                    map.set(item, 2)
                } else {
                    map.set(item, 1)
                }
            })
        }
        const result = [...map]
            .filter(([key, value]) => value > 1)
            .map(([key, value]) => key)
        return result
    }

    // 获取交集
    getIntersection(vertexIdList) {
        window.adj = [0, 0]
        if (vertexIdList.length <= 0) return this.getVertexIdList()
        if (vertexIdList.length === 1)
            return this.getVertexIdList(vertexIdList[0])
        const map = new Map()
        const arr = []
        // 1. 取各顶点的规格
        for (let i = 0; i < vertexIdList.length; i++) {
            const id = vertexIdList[i]
            const vertex = this.getVertexById(id)
            arr.push(vertex.sku)
            // 2. 取顶点下各个邻接点的交集, map为2说明出现了两次，则存在交集
            const adjList = this.adjList.get(vertex)
            log('adj', adjList)
            window.adj[i] = adjList
            for (let j = 0; j < adjList.length; j++) {
                const item = adjList[j]
                if (!map.has(item)) {
                    map.set(item, 1)
                } else {
                    map.set(item, 2)
                }
            }
        }
        log(
            '[...map]',
            [...map],
            [...map]
                .filter(([key, value]) => value > 1)
                .map(([key, value]) => key)
        )
        // 1.1 取出各顶点的规格交集
        const set = this.getSkuIntersection(arr)
        // 通过1和2 得出正确的交集
        const result = [...map]
            .filter(([key, value]) => value > 1)
            .filter(([key, value]) => {
                const sku = key.sku
                const result = set.every(item => sku.has(item))
                return result
            })
            .map(([key, value]) => key.id)
        return result
    }
}

export default AdjacencyListGraph
