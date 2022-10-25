/**
 * 数据格式设计
 *
 *
 * [{
 *   code: '',
 *   nationality: '',
 *   sex: '',
 *   time: '',
 *   title: '', 1. 标题
 *   score: '', 2. 水平（中级和高级）
 *   certificate: '', 3. 体裁 4. 国籍 5. 文章内容 6. 来源 7. 自定义
 *   content: {
 *     info: '',
 *     txt: ''
 *   }
 *   formatContent: {
 *     info: '',
 *     txt: ''
 *   },
 *   annotation: {
 *     123:''
 *   }
 * }]
 */
// var data = new FormData()
// data.append('zwm', '199312123523100103')

// const queryData = () => {}

// const getContent = zwm => {
//     fetch('http://hsk.blcu.edu.cn/Index/get_zwm_txt', {
//         method: 'POST',
//         body: `zwm=${zwm}`,
//         headers: {
//             Cookie: 'PHPSESSID=3t94eftd5s7n3n9a06euflqv6d; PHPSESSID_NS_Sig=oenCV6mfmnop-1Pu; VGOTCN_OnLineCount=U2',
//             'User-Agent':
//                 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
//             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         },
//     })
//         .then(response => response.json())
//         .then(json => {
//             console.log('json')
//         })
//         .catch(err => console.log('Request Failed', err))
// }

// // 替换文本
// const main = () => {}

// '{CP做为[C]清官来[F來]讲[C]，法律应该[F該]是无情的。P}'.replace(
//     /\{CP(.*?)P\}/g,
//     '$1'
// )
// // \{CP(.*?)P\}
// var str = ''
// str
//     .replace(/\[.*?\]/g, '')
//     // 忽略CP标注
//     .replace(/\{CP(.*?)P\}/g, '$1')
//     .replace(/\{CQ(.*?)Q\}/g, '$1')
//     .replace(/\{.*?\}/g, '')`
// 199508香港.0000705436341504
//   “安乐死”是一件[C]不平凡的事情。从不同的角度看这[F這]个问题会有不[C]同的见解和结论。争论的主要焦点在于如何处理好法律与[C]人之常情{CC人事常情}{CQ的}关系。
//     根据严格的法律，我相信法院判的对。既然故意杀人，就有罪。{CP做为[C]清官来[F來]讲[C]，法律应该[F該]是无情的。P}法官会认[C]为如果法律随[F隨]时变动，可妥[C]协的话[F話]，一个国家如何用{CJ+sy执行}法制来[F來]治[B制]理{CJ+by国家}呢？
//     {CP可是不幸的是世界上的千变万[C]化，另外人民的人情关系，宗[B崇]教信仰及风俗习惯都具有悠[B攸]久的历史。P}我们[F們]的法律制度不仅不可能提供足够[F夠]的条例[C]来[F來]概括人们[F們]生活中多种多样{CJ+dy发生}的事情，另外在很多方面[L]将与人们[F們]的风俗习惯，崇教信仰发生冲突。
//     {CP因此虽然从法律的观[C]点{CQ来看}似乎[B呼]法院的判决是{CD有}符合法律的，可是根据人情的道理，由于他的杀人目[C]的是好意，即为了使他的妻子不再痛苦，法院的判决，说[F說]他故意杀人罪是没有道理{CJsd}[BQ。]P}
//     从以上的两[F兩]个[F個]不同观[C]点{CQ来看}，我觉[C]得评[F評]论[C]“安乐死”事件不能一边倒[C]。我们[F們]不能简单的说[F說]丈夫有罪或无罪，因为我[C]们[F們]既[B即]要讲[C]法律也要讲[C]人情。{CP我觉[C]得最好的方法是调[F調]查当地人们[F們]的意见[F見]，慎重考虑是否在人情的分上，我们[F們]是否应该[F該]这[F這]件做一个明智的决定，即不削[B消]弱法律的作用，又可以照[C]顾[C]人情的道理。P}
//     另外，我[C]们还可以提出，根据“安乐死”事件，修正或更改我们[F們]的法律条例[C]，为以后发生的类似事件提供既{CC又}符合法律又{CC及}符合人情的解[C]决方法。
// `

export const mapColorToHex = {
    blue: '#0d6efd',
    indigo: '#6610f2',
    purple: '#6f42c1',
    pink: '#d63384',
    red: '#dc3545',
    orange: '#fd7e14',
    yellow: '#ffc107',
    green: '#198754',
    teal: '#20c997',
    cyan: '#0dcaf0',
}

export const presetColor = [
    {
        key: 'blue',
        label: '蓝色',
        value: '#0d6efd',
    },
    {
        key: 'indigo',
        label: '靛蓝色',
        value: '#6610f2',
    },
    {
        key: 'purple',
        label: '紫色',
        value: '#6f42c1',
    },
    {
        key: 'pink',
        label: '粉色',
        value: '#d63384',
    },
    {
        key: 'red',
        label: '红色',
        value: '#dc3545',
    },
    {
        key: 'orange',
        label: '橙色',
        value: '#fd7e14',
    },
    {
        key: 'yellow',
        label: '黄色',
        value: '#ffc107',
    },
    {
        key: 'green',
        label: '绿色',
        value: '#198754',
    },
    {
        key: 'teal',
        label: '蓝绿色',
        value: '#20c997',
    },
    {
        key: 'cyan',
        label: '青色',
        value: '#0dcaf0',
    },
]

// 通过属性选择器，获取对应的
export const getDomByDataId = highlightId => {
    let span = document.querySelectorAll(
        `span[data-highlight-id="${highlightId}"]`
    )
    if (span.length <= 0)
        span = document.querySelectorAll(
            `span[data-highlight-id-extra="${highlightId}"]`
        )
    return span
}

// 清除高亮区域下所有的i标签
export const clearHightLight = el => {
    const list = el.querySelectorAll('i')
    for (let i = 0; i < list.length; i++) {
        const parentElement = list[i].parentElement
        parentElement.removeChild(list[i])
    }
}

export const addClass = (el, className) => {
    if (!el.classList.contains(className)) {
        el.classList.add(className)
    }
}

// 对高亮的span元素进行设置
export const setHightlightSpanEl = (els, option) => {
    const { text, color } = option
    for (let i = 0; i < els.length; i++) {
        let el = els[i]
        addClass(el, `color-${color}`)
        let highlightId = el.dataset.highlightIdExtra || el.dataset.highlightId
        const spans = getDomByDataId(highlightId)
        if (el === spans[0]) {
            if (!el.dataset.text || el.dataset.text === 'null') {
                // console.log('el被设置为', text, highlightId)
                el.dataset.text = text
            }
        } else {
            // console.log('el被设置为', null, highlightId)
            el.dataset.text = 'null'
            if (el.dataset.highlightSplitType === 'tail') {
                if (spans[0].dataset.text === 'null') {
                    spans[0].dataset.text = text
                }
            }
        }
        // 再添加新的
    }
}

export const getParams = param => {
    const url = new URL(window.location.href)
    return url.searchParams.get(param)
}
