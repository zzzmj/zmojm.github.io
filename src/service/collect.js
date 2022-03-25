import LC from './index'

export const getCollectList = questionIds => {
    const query = new LC.Query('Collection')
    // query.descending('createdAt')
    query.limit(1000)
    if (questionIds) {
        query.containedIn('id', questionIds)
    }
    return query.find()
}

export const addCollect = data => {
    const list = []
    data.forEach(item => {
        const Question = LC.Object.extend('Collection')
        const question = new Question()
        Object.keys(item).forEach(key => {
            question.set(key, item[key])
        })
        list.push(question)
    })
    return LC.Object.saveAll(list)
}

// delete
export const deleteCollect = objectId => {
    const question = LC.Object.createWithoutData('Collection', objectId)
    return question.destroy()
}
