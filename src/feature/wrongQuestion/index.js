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

/**
 * Import JSON
 */
function importJSON() {
    return new Promise((resolve, reject) => {
        let input = document.createElement('input')
        input.type = 'file'
        input.onchange = event => {
            let files = event.target.files
            if (!files || !files.length) {
                input = null
                reject(new Error('No files'))
            }

            // if (files[0].type !== 'application/json') {
            //   reject(new Error('It is not a json file'))
            // }

            let reader = new FileReader()
            reader.onload = event => {
                try {
                    let config = JSON.parse(event.target.result)
                    resolve(config)
                } catch (e) {
                    reject(e)
                }
                input = null
            }
            reader.readAsText(files[0])
        }

        input.click()
    })
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
        .then(responce => {
            return handleResponce(url, responce)
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

function post(url, data) {
    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        data: data,
    })
        .then(responce => {
            return handleResponce(url, responce)
        })
        .catch(error => {
            console.error(`POST Request fail. url:${url}. message:${error}`)
            return Promise.reject({
                error: {
                    message: 'POST Request failed.',
                },
            })
        })
}

function handleResponce(url, responce) {
    let res = responce
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

// 通过题目id查询题目内容以及解析
const getSolutionById = ids => {
    const url = `https://tiku.fenbi.com/api/xingce/solutions?ids=${ids}&app=web&kav=12&version=3.0.0.0`
    get(url).then(res => {
        // content: 内容
        // correctAnswer: 正确答案
        // solution: 解析
        // source：来源
        // keyPoint: { id, name } 题目分类
        // questionMeta: { mostWrongAnswer }
    })
    return get(url)
}

const main = async () => {
    const categoryList = [22017, 22018, 22019, 22020, 22021]
    const data = {}
    for (let i = 0; i < categoryList.length; i++) {
        const item = categoryList[i]
        const questionIds = await getQuestionIdByCategoryId(item)
        const solution = await getSolutionById(questionIds.toString())
        data[item] = solution
    }
    exportJSON(data, 'fenbiData')
}

// main()
