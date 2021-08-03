// 服务提供.
import LC from 'leancloud-storage'

// leanCloud 初始化
LC.init({
    appId: 'zhG78X78KsJ4MuyLquDrtexj-gzGzoHsz',
    appKey: 'QhcOlKH32P32CCaEUbzJJWbo',
    serverURL: 'https://syolnpzm.lc-cn-n1-shared.com',
})

// 登录接口
export const Login = (username, password) => {
    return LC.User.logIn(username, password)
}

// 新增配置到leanCloud
export const addConfigToLeanCloud = data => {
    const Configs = LC.Object.extend('Configs')
    const configs = new Configs()
    Object.keys(data).forEach(key => {
        configs.set(key, data[key])
    })
    return configs.save()
}

// 从leanCloud获取数据
export const getConfigFromLeanCloud = objectId => {
    const query = new LC.Query('Configs')
    if (objectId) return query.get(objectId)
    else return query.find()
}

// update
export const updateConfigToLeanCloud = (objectId, data) => {
    const config = LC.Object.createWithoutData('Configs', objectId)
    Object.keys(data).forEach(key => {
        config.set(key, data[key])
    })
    return config.save()
}

// delete
export const deleteConfigToLeanCloud = objectId => {
    const todo = LC.Object.createWithoutData('Configs', objectId)
    return todo.destroy()
}

// test
export const testConfigFromLeanCloud = () => {
    const query = new LC.Query('Configs')
    query.find().then(configs => {
        console.log('configs', configs)
    })
}

export const queryListFromLeanCloud = data => {
    const query = new LC.Query('Configs')
    Object.keys(data).forEach(key => {
        data[key] && query.equalTo(key, data[key])
    })
    return query.find()
}

// export const updateConfig = createAsyncThunk(
//     'category/updateConfig',
//     async (option, { getState}) => {

//     }
// )
