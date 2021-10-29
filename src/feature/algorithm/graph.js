// adjacency matrix
// Adjacency table
class Graph {
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
        vertex.forEach(v => {
            this.addVertex(v)
        })
        // 2. 约束条件添加边
        // 同级可选
        for (let i = 0; i < commoditySpecs.length; i++) {
            const item = commoditySpecs[i].list
            for (let j = 0; j < item.length; j++) {
                for (let k = 0; k < item.length; k++) {
                    this.addEdge(item[j], item[k])
                }
            }
        }

        // 限制条件
        for (let i = 0; i < limitData.length; i++) {
            const item = limitData[i].list
            for (let j = 0; j < item.length; j++) {
                for (let k = 0; k < item.length; k++) {
                    this.addEdge(item[j], item[k])
                }
            }
        }
        console.log('commoditySpecs, limitData', commoditySpecs, limitData)
    }

    // 判断顶点是否存在
    hasVertex(v) {
        return this.vertices.includes(v)
    }

    // 判断边是否存在
    hasEdge(v, w) {
        return this.adjList.get(v).includes(w)
    }

    // 添加顶点
    addVertex(v) {
        if (this.hasVertex(v)) return
        this.vertices.push(v)
        this.adjList.set(v, [])
    }

    // 建立v => w的边联系
    addEdge(v, w) {
        if (!this.hasVertex(v) || !this.hasVertex(w)) {
            console.log('v, w节点不存在, 请先添加入节点中')
        }
        if (!this.hasEdge(v, w)) {
            this.adjList.get(v).push(w)
            // 无向图则建立 w => v的联系
            if (!this.isDirected && !this.hasEdge(v, w)) {
                this.adjList.get(w).push(v)
            }
        }
    }

    getVertices() {
        return this.vertices
    }

    getAdjList() {
        return this.adjList
    }

    toString() {
        let s = ''
        for (let i = 0; i < this.vertices.length; i++) {
            s += `${this.vertices[i]} -> `
            const neighbors = this.adjList.get(this.vertices[i])
            for (let j = 0; j < neighbors.length; j++) {
                s += `${neighbors[j]} `
            }
            s += '\n'
        }
        return s
    }

    // 判断v1和v2是否连通
    find(v1, v2) {
        return this.adjList.get(v1).includes(v2)
    }

    // 获取交集
    getIntersection(vertexList) {
        if (vertexList.length <= 0) return this.getVertices()
        if (vertexList.length === 1) return this.adjList.get(vertexList[0])
        const map = new Map()
        // 传入
        vertexList.forEach(vertex => {
            const arr = this.adjList.get(vertex)
            console.log('arr', arr)
            arr.forEach(item => {
                if (!map.has(item)) {
                    map.set(item, 1)
                } else {
                    map.set(item, 2)
                }
            })
        })
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

export default Graph
