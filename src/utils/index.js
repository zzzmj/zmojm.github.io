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
 *   }
 * }]
 */
var data = new FormData()
data.append('zwm', '199312123523100103')

const queryData = () => { }

const getContent = zwm => {
    fetch('http://hsk.blcu.edu.cn/Index/get_zwm_txt', {
        method: 'POST',
        body: `zwm=${zwm}`,
        headers: {
            Cookie: 'PHPSESSID=3t94eftd5s7n3n9a06euflqv6d; PHPSESSID_NS_Sig=oenCV6mfmnop-1Pu; VGOTCN_OnLineCount=U2',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(json => {
            console.log('json')
        })
        .catch(err => console.log('Request Failed', err))
}

// 替换文本
const main = () => { }

'{CP做为[C]清官来[F來]讲[C]，法律应该[F該]是无情的。P}'.replace(
    /\{CP(.*?)P\}/g,
    '$1'
)
// \{CP(.*?)P\}
var str = ''
str
    .replace(/\[.*?\]/g, '')
    // 忽略CP标注
    .replace(/\{CP(.*?)P\}/g, '$1')
    .replace(/\{CQ(.*?)Q\}/g, '$1')
    .replace(/\{.*?\}/g, '')`
199508香港.0000705436341504
  “安乐死”是一件[C]不平凡的事情。从不同的角度看这[F這]个问题会有不[C]同的见解和结论。争论的主要焦点在于如何处理好法律与[C]人之常情{CC人事常情}{CQ的}关系。
    根据严格的法律，我相信法院判的对。既然故意杀人，就有罪。{CP做为[C]清官来[F來]讲[C]，法律应该[F該]是无情的。P}法官会认[C]为如果法律随[F隨]时变动，可妥[C]协的话[F話]，一个国家如何用{CJ+sy执行}法制来[F來]治[B制]理{CJ+by国家}呢？
    {CP可是不幸的是世界上的千变万[C]化，另外人民的人情关系，宗[B崇]教信仰及风俗习惯都具有悠[B攸]久的历史。P}我们[F們]的法律制度不仅不可能提供足够[F夠]的条例[C]来[F來]概括人们[F們]生活中多种多样{CJ+dy发生}的事情，另外在很多方面[L]将与人们[F們]的风俗习惯，崇教信仰发生冲突。
    {CP因此虽然从法律的观[C]点{CQ来看}似乎[B呼]法院的判决是{CD有}符合法律的，可是根据人情的道理，由于他的杀人目[C]的是好意，即为了使他的妻子不再痛苦，法院的判决，说[F說]他故意杀人罪是没有道理{CJsd}[BQ。]P}
    从以上的两[F兩]个[F個]不同观[C]点{CQ来看}，我觉[C]得评[F評]论[C]“安乐死”事件不能一边倒[C]。我们[F們]不能简单的说[F說]丈夫有罪或无罪，因为我[C]们[F們]既[B即]要讲[C]法律也要讲[C]人情。{CP我觉[C]得最好的方法是调[F調]查当地人们[F們]的意见[F見]，慎重考虑是否在人情的分上，我们[F們]是否应该[F該]这[F這]件做一个明智的决定，即不削[B消]弱法律的作用，又可以照[C]顾[C]人情的道理。P}
    另外，我[C]们还可以提出，根据“安乐死”事件，修正或更改我们[F們]的法律条例[C]，为以后发生的类似事件提供既{CC又}符合法律又{CC及}符合人情的解[C]决方法。
`
