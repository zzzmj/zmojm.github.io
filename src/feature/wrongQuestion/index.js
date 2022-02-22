/**
 * Export JSON
 */
function exportJSON(data = {}, filename) {
    let link = document.createElement('a')
    if (!filename) {
        filename = `${Date.now()}.json`
    }
    if (!/\.json$/.test(filename)) {
        filename += '.json'
    }
    link.download = filename
    link.href =
        'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(data))
    link.click()
    link = null
}

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

function get(url) {
    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: headers,
    })
        .then(response => {
            return handleResponse(url, response)
        })
        .catch(error => {
            console.error(`GET Request fail. url:${url}. message:${error}`)
            return Promise.reject({
                error: {
                    message: 'GET Request failed.',
                },
            })
        })
}

function handleResponse(url, response) {
    let res = response
    if (res.status === 200) {
        return res.json()
    } else {
        console.error(`Request fail. url:${url}`)
        Promise.reject({
            error: {
                message: 'Request failed due to server error',
            },
        })
    }
}

/**
 * 查询题目列表的id
 * @param {*} categoryId
 * 言语：22017
 * 数量：22018
 * 判断：22019
 * 资料：22020
 * 常识：22021
 * @returns Promise
 */
const getQuestionIdByCategoryId = categoryId => {
    const url = `https://tiku.fenbi.com/api/xingce/errors?categoryId=${categoryId}&offset=0&limit=10000&order=asc&timeRange=0&app=web&kav=12&version=3.0.0.0`

    return get(url)
}

const getCategoryTree = () => {
    const url = `https://tiku.fenbi.com/api/xingce/errors/keypoint-tree?timeRange=0&app=web&kav=12&version=3.0.0.0`

    return get(url)
}

// 通过题目id查询题目内容以及解析
const getSolutionById = ids => {
    const url = `https://tiku.fenbi.com/api/xingce/solutions?ids=${ids}&app=web&kav=12&version=3.0.0.0`
    // get(url).then(res => {
    //     // content: 内容
    //     // correctAnswer: 正确答案
    //     // accessories 选项
    //     // solution: 解析
    //     // source：来源
    //     // keyPoint: { id, name } 题目分类
    //     // questionMeta: { mostWrongAnswer }
    // })
    return get(url)
}

const exportWrongQuestion = async () => {
    // 言语：22017
    // 数量：22018
    // 判断：22019
    // 资料：22020
    // 常识：22021
    // const categoryList = [22017, 22018, 22019, 22020, 22021]
    const data = {}
    const questionIds = []
    const keyPointTree = await getCategoryTree()
    keyPointTree &&
        keyPointTree.forEach(item => {
            questionIds.push(...item.questionIds)
        })
    const solution = await getSolutionById(questionIds.toString())
    data.question = solution
    data.category = keyPointTree
    exportJSON(data, 'fenbiData')
}

const registerExportBtn = () => {
    var html = `<button class="export-question">导出错题</button>`
    var wrap = document.querySelector('#keypoint-list .sort-filter')
    wrap.insertAdjacentHTML('beforeend', html)
    wrap.addEventListener('click', e => {
        var el = e.target
        if (el && el.classList.contains('export-question')) {
            console.log('导出错题')
            exportWrongQuestion()
        }
    })
}

registerExportBtn()
