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

// delete
export const deleteQuestion = objectId => {
    const question = LC.Object.createWithoutData('Question', objectId)
    return question.destroy()
}

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

export const getCategoryQuestion = () => {
    const query = new LC.Query('Category')
    return query.get('62031ff0a10bf856ff93cf99')
}
