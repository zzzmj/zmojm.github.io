class AdjacencyMatrixGraph {
    constructor(isDirected = false) {
        this.vertices = [] //顶点 vertex的复数
        this.adjList = new Map() // 邻接表 Adjacency
        this.adjMatrix = [] // 邻接矩阵
        this.mapVertexToIndex = {} //
        this.isDirected = isDirected // 是否为有向图
    }

    initMatrix(matrixLength = 10) {
        const length = matrixLength
        const arr = []
        for (let i = 0; i < length; i++) {
            arr.push(new Array(length).fill('').map(() => new Set()))
        }
        return arr
    }

    loadDataSource(commoditySpecs, limitData) {
        // 1. 通过规格添加顶点
        const vertex = commoditySpecs.reduce((acc, cur) => {
            return acc.concat(cur.list)
        }, [])
        // 2.
        this.adjMatrix = this.initMatrix(vertex.length)
        vertex.forEach(v => {
            this.addVertex(v)
        })
        // 2. 约束条件添加边
        // 同级可选
        for (let i = 0; i < commoditySpecs.length; i++) {
            const item = commoditySpecs[i].list
            for (let j = 0; j < item.length; j++) {
                for (let k = 0; k < item.length; k++) {
                    if (item[j] !== item[k]) {
                        this.addEdge(item[j], item[k], -1)
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

    // 添加顶点
    addVertex(v) {
        this.mapVertexToIndex[v] = this.vertices.length
        this.vertices.push(v)
        // this.adjList.set(v, []);
    }

    // 建立v => w的边联系
    addEdge(v, w, skuId) {
        const vIndex = this.mapVertexToIndex[v]
        const wIndex = this.mapVertexToIndex[w]
        if (vIndex === -1 || wIndex === -1) {
            console.log('顶点不存在, 请先添加顶点')
            return
        }
        this.adjMatrix[vIndex][wIndex].add(skuId)
        this.adjMatrix[wIndex][vIndex].add(skuId)
    }

    toString() {
        let s = ''
        console.log('', this.vertices)
        for (let i = 0; i < this.vertices.length; i++) {
            s += `${this.vertices[i]} -> `
            const neighbors = this.adjMatrix[i]
            for (let j = 0; j < neighbors.length; j++) {
                s += `[${[...neighbors[j]]}] `
            }
            s += '\n'
        }
        return s
    }

    isRepeatElement(a, b) {
        const size = a.size + b.size
        const newSet = new Set([...a, ...b])
        return !(size === newSet.size)
    }

    // 获取交集
    getIntersection(vertexList) {
        if (vertexList.length <= 0) return this.getVertices()
        if (vertexList.length === 1) return this.adjList.get(vertexList[0])

        const compareMatrix = []
        const map = new Map()

        // 传入
        vertexList.forEach(vertex => {
            // 该商品所在的列
            const index = this.mapVertexToIndex[vertex]
            const arr = this.adjMatrix[index]
            console.log('arr', arr)
            compareMatrix.push(arr)
        })
        for (let i = 0; i < compareMatrix.length; i++) {
            const m = compareMatrix[i]
            for (let j = 0; j < m.length; j++) {
                compareMatrix[i][j]
            }
        }
        console.log('map', [...map])
        const arr = []
        map.forEach((value, key) => {
            console.log('key, value', key, value)
            if (map.get(key) > 1) {
                arr.push(key)
            }
        })
        return arr
    }
}

export default AdjacencyMatrixGraph
