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
data.append('zwm', "199312123523100103")

const queryData = () => {
    
}

const getContent = (zwm) => {
    fetch('http://hsk.blcu.edu.cn/Index/get_zwm_txt', {
        method: 'POST',
        body: `zwm=${zwm}`,
        headers: {
            Cookie: "PHPSESSID=3t94eftd5s7n3n9a06euflqv6d; PHPSESSID_NS_Sig=oenCV6mfmnop-1Pu; VGOTCN_OnLineCount=U2",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    })
        .then(response => response.json())
        .then(json => {

            console.log('json')
        })
        .catch(err => console.log('Request Failed', err))
}

// 替换文本
const main = () => {
    
}

var str = ''
str.replace(/\[.*?\]/g, '').replace(/\{.*?\}/g, '')