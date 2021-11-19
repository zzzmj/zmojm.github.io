class AdjacencyMatrixGraph {
    constructor() {
        this.vertices = [] //顶点 vertex的复数
        this.adjMatrix = [] // 邻接矩阵
        this.mapVertexToIndex = {} //
        this.SiblingVertex = -1
        this.existVertices = []
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
        // 2. init matrix
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
                        this.addEdge(item[j], item[k], this.SiblingVertex)
                    }
                }
            }
        }

        const set = new Set()
        // 限制条件
        for (let i = 0; i < limitData.length; i++) {
            const item = limitData[i].list
            const skuId = limitData[i].skuId
            for (let j = 0; j < item.length; j++) {
                set.add(item[j])
                for (let k = 0; k < item.length; k++) {
                    if (item[j] !== item[k]) {
                        this.addEdge(item[j], item[k], skuId)
                    }
                }
            }
        }
        this.existVertices = [...set]
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

    // set
    containRepeatElement(arr) {
        const args = arr
        if (args <= 1) return false
        const obj = {}
        let isSibling = false
        for (let i = 0; i < args.length; i++) {
            const g = [...args[i]]
            for (let j = 0; j < g.length; j++) {
                const item = g[j]
                // 存在同级的规格，返回true
                if (item === this.SiblingVertex) {
                    isSibling = true
                } else {
                    // 存在重复的规格，则return true
                    if (!obj[item]) {
                        obj[item] = 1
                    } else {
                        return true
                    }
                }
            }
        }
        console.log('isSibling', isSibling, obj)
        if (isSibling && Object.keys(obj).length > 0) return true
        return false
    }

    getColumn(index, vertexList) {
        const vis = vertexList.map(v => this.mapVertexToIndex[v])
        const arr = []
        const m = this.adjMatrix
        for (let i = 0; i < this.vertices.length; i++) {
            if (vis.includes(i)) {
                for (let j = 0; j < this.vertices.length; j++) {
                    if (j === index) {
                        arr.push(m[i][j])
                    }
                }
            }
        }
        return arr
    }

    // 获取交集
    getIntersection(vertexList) {
        if (vertexList.length <= 0) return this.getVertices()
        if (vertexList.length === 1) {
            const index = this.mapVertexToIndex[vertexList[0]]
            // uuzu
            const arr = this.adjMatrix[index]
            const result = []
            for (let i = 0; i < this.vertices.length; i++) {
                if (arr[i].size > 0) {
                    result.push(this.vertices[i])
                }
            }
            return result
        }

        const compareMatrix = []
        // 取出需要比较的顶点对应的边
        vertexList.forEach(vertex => {
            const index = this.mapVertexToIndex[vertex]
            const arr = this.adjMatrix[index]
            compareMatrix.push(arr)
        })

        const intersection = []
        console.log('graph\n', this.toString())
        console.log('compareMatrix', compareMatrix)
        // 遍历列
        for (let i = 0; i < this.vertices.length; i++) {
            //
            const col = this.getColumn(i, vertexList)
            console.log('col i', i, col)
            const result = this.containRepeatElement(col)
            console.log('result', result)
            // console.log(`compare ${i}`, result)
            if (result) {
                intersection.push(this.vertices[i])
            }
        }
        return intersection
    }

    getVertices() {
        return this.vertices
    }

    getExistVertices() {
        return this.existVertices
    }
}

export default AdjacencyMatrixGraph
