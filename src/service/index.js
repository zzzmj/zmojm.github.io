import LC from 'leancloud-storage'

// leanCloud 初始化
LC.init({
    appId: 'zhG78X78KsJ4MuyLquDrtexj-gzGzoHsz',
    appKey: 'QhcOlKH32P32CCaEUbzJJWbo',
    serverURL: 'https://zhg78x78.lc-cn-n1-shared.com',
})

// 封装增删改查的函数

class Util {
    // get查询
    get(options) {
        const { tableName, objectId } = options
        const query = new LC.Query(tableName)
        if (objectId) return query.get(objectId)
        else {
            query.limit(1000)
            return query.find()
        }
    }
}

export default LC
