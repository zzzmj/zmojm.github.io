import LC from './index'

export const getQuestionList = questionIds => {
    const query = new LC.Query('Question')
    // query.descending('createdAt')
    query.limit(1000)
    if (questionIds) {
        query.containedIn('id', questionIds)
    }
    return query.find()
}

export const existQuestion = objectId => {
    const query = new LC.Query('Question')
    if (typeof objectId === 'object') {
        query.containedIn('id', objectId)
    } else {
        query.equalTo('id', objectId)
    }
    query.limit(1000)
    return query.find()
}

// 新增题目到leanCloud
export const addQuestion = data => {
    const list = []
    data.forEach(item => {
        const Question = LC.Object.extend('Question')
        const question = new Question()
        Object.keys(item).forEach(key => {
            question.set(key, item[key])
        })
        list.push(question)
    })
    return LC.Object.saveAll(list)
}

export const updateQuestionNotes = (objectId, notes) => {
    const q = LC.Object.createWithoutData('QuestionBook', objectId)
    // 更新笔记
    return q.save({ notes })
}

// delete
export const deleteQuestion = objectId => {
    const question = LC.Object.createWithoutData('Question', objectId)
    return question.destroy()
}

// 这是粉笔错题分类表
// 种类表添加种类
export const addCategoryQuestion = data => {
    let question = LC.Object.createWithoutData(
        'Category',
        '62031ff0a10bf856ff93cf99'
    )
    Object.keys(data).forEach(key => {
        question.set(key, data[key])
    })
    return question.save()
}

export const getCategoryQuestion = objectId => {
    const query = new LC.Query('Category')
    return query.get(objectId || '62031ff0a10bf856ff93cf99')
}

// 自定义错题分类表
export const addCustomWrongQuestionCategory = data => {
    let question = LC.Object.createWithoutData(
        'Category',
        '6253f0461122b910ec5dfd1e'
    )
    Object.keys(data).forEach(key => {
        question.set(key, data[key])
    })
    return question.save()
}

export const getCustomWrongQuestionCategory = () => {
    const query = new LC.Query('Category')
    return query.get('6253f0461122b910ec5dfd1e')
}
