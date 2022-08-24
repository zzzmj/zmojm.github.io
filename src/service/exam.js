import LC from './index'

export const getExamList = questionIds => {
    const query = new LC.Query('FbQuestion')
    // query.descending('createdAt')
    query.limit(1000)
    if (questionIds) {
        query.containedIn('id', questionIds)
    }
    return query.find()
}

export const getBookList = (questionIds, skip) => {
    const query = new LC.Query('QuestionBook')
    // query.descending('createdAt')
    query.limit(1000)
    if (skip) {
        query.skip(skip)
    }
    if (questionIds) {
        query.containedIn('id', questionIds)
    }
    return query.find()
}

export const addExam = data => {
    const list = []
    data.forEach(item => {
        const Question = LC.Object.extend('FbQuestion')
        const question = new Question()
        Object.keys(item).forEach(key => {
            question.set(key, item[key])
        })
        list.push(question)
    })
    return LC.Object.saveAll(list)
}

// delete
export const deleteExam = objectId => {
    const question = LC.Object.createWithoutData('FbQuestion', objectId)
    return question.destroy()
}
