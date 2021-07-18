/**
 * 技术方案构想：
 * 每次编辑后，将html传给服务器即可。
 *
 * UI设计。
 * - 高亮
 * - 标签
 */
import React from 'react'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useRef } from 'react'
import Highlighter from 'web-highlighter'
import './Annotation.scss'
import { Button } from 'react-bootstrap'

const log = console.log.bind(console, '[annota]')
// 自定义颜色。

const annotationColor = {
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

const processText = str => {
    // 已经处理过的不再处理
    // if (str.includes('<br/>')) return str
    return str
        .replace(/\[.*?\]/g, '')
        .replace(/\{CP(.*?)P\}/g, '$1')
        .replace(/\{CQ(.*?)\}/g, '$1')
        .replace(/\{.*?\}/g, '')
        .replaceAll('。', '。</p><p>')
        .replaceAll('\n', '')
        .replaceAll(' ', '')
    // .replaceAll('<br/>', '</p><p>')
}

/**
 * 例如这句话：从不同的角度看【这个问题】会有不同的见解和结论。
 * 通过：sEl.splitText(sOffset) 打断成：【从不同的角度看，这个问题会有不同的见解和结论】
 * 再通过 newNode.splitText(eOffset - sOffset)打断成[从不同的角度看【这个问题】会有不同的见解和结论。]
 * @param {*} startNode
 * @param {*} endNode
 */
const getSelectedNodes = (startNode, endNode) => {
    const sEl = startNode.node
    const eEl = endNode.node
    const sOffset = startNode.offset
    const eOffset = endNode.offset
    console.log('sOffset', sOffset, eOffset)
    // 利用sOffset打断成两个节点。 ...s....
    const newNode = sEl.splitText(sOffset)

    try {
        if (sEl.parentNode === eEl.parentNode) {
            newNode.splitText(eOffset - sOffset)
        }
    } catch (error) {
        console.log(error)
    }

    return newNode
}

const addHighLight = node => {
    const wrap = document.createElement('span')
    wrap.setAttribute('class', 'highlight')
    wrap.appendChild(node.cloneNode(false))
    console.log('wrap', wrap, node.parentNode)
    node.parentNode.replaceChild(wrap, node)
}

// 侧边栏
const Annotation = props => {
    const { className } = props
    const highlighter = useRef(null)
    const contentRef = useRef(null)
    const prefix = 'zz-annotation'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    const content = processText(
        `199508香港.0000705436341504
  “安乐死”是一件[C]不平凡的事情。从不同的角度看这[F這]个问题会有不[C]同的见解和结论。争论的主要焦点在于如何处理好法律与[C]人之常情{CC人事常情}{CQ的}关系。
    根据严格的法律，我相信法院判的对。既然故意杀人，就有罪。{CP做为[C]清官来[F來]讲[C]，法律应该[F該]是无情的。P}法官会认[C]为如果法律随[F隨]时变动，可妥[C]协的话[F話]，一个国家如何用{CJ+sy执行}法制来[F來]治[B制]理{CJ+by国家}呢？
    {CP可是不幸的是世界上的千变万[C]化，另外人民的人情关系，宗[B崇]教信仰及风俗习惯都具有悠[B攸]久的历史。P}我们[F們]的法律制度不仅不可能提供足够[F夠]的条例[C]来[F來]概括人们[F們]生活中多种多样{CJ+dy发生}的事情，另外在很多方面[L]将与人们[F們]的风俗习惯，崇教信仰发生冲突。
    {CP因此虽然从法律的观[C]点{CQ来看}似乎[B呼]法院的判决是{CD有}符合法律的，可是根据人情的道理，由于他的杀人目[C]的是好意，即为了使他的妻子不再痛苦，法院的判决，说[F說]他故意杀人罪是没有道理{CJsd}[BQ。]P}
    从以上的两[F兩]个[F個]不同观[C]点{CQ来看}，我觉[C]得评[F評]论[C]“安乐死”事件不能一边倒[C]。我们[F們]不能简单的说[F說]丈夫有罪或无罪，因为我[C]们[F們]既[B即]要讲[C]法律也要讲[C]人情。{CP我觉[C]得最好的方法是调[F調]查当地人们[F們]的意见[F見]，慎重考虑是否在人情的分上，我们[F們]是否应该[F該]这[F這]件做一个明智的决定，即不削[B消]弱法律的作用，又可以照[C]顾[C]人情的道理。P}
    另外，我[C]们还可以提出，根据“安乐死”事件，修正或更改我们[F們]的法律条例[C]，为以后发生的类似事件提供既{CC又}符合法律又{CC及}符合人情的解[C]决方法。
`
    )

    useEffect(() => {
        highlighter.current = new Highlighter()
        const h = highlighter.current
        h.on(Highlighter.event.CREATE, function (data, inst, e) {
            log('data', data, inst, e)
        })
        h.hooks.Render.WrapNode.tap((id, node) => {
            log('我想添加一些东西', id, node)
        })

        h.on(Highlighter.event.CLICK, ({ id }) => {
            log('click -', id)
        })
            .on(Highlighter.event.HOVER, ({ id }) => {
                log('hover -', id)
                h.addClass('highlight-wrap-hover', id)
            })
            .on(Highlighter.event.HOVER_OUT, ({ id }) => {
                log('hover out -', id)
                h.removeClass('highlight-wrap-hover', id)
            })
        // highlighter.current.run()
    }, [])

    useEffect(() => {
        const handleMouseUp = () => {
            const range = window.getSelection().getRangeAt(0)
            const start = {
                node: range.startContainer,
                offset: range.startOffset,
            }
            const end = {
                node: range.endContainer,
                offset: range.endOffset,
            }
            const result = getSelectedNodes(start, end)
            console.log('result', result)
            addHighLight(result)
        }
        contentRef.current.addEventListener('mouseup', () => {
            // add some listeners to handle interaction, such as hover
            // highlighter
            //     .on('selection:hover', ({ id }) => {
            //         // display different bg color when hover
            //         highlighter.addClass('highlight-wrap-hover', id)
            //     })
            //     .on('selection:hover-out', ({ id }) => {
            //         // remove the hover effect when leaving
            //         highlighter.removeClass('highlight-wrap-hover', id)
            //     })
            //     .on('selection:create', ({ sources }) => {
            //         sources = sources.map(hs => ({ hs }))
            //         console.log('sources', sources)
            //     })
            // retrieve data from store, and display highlights on the website
            // store.getAll().forEach(
            //     // hs is the same data saved by 'store.save(sources)'
            //     ({ hs }) =>
            //         highlighter.fromStore(
            //             hs.startMeta,
            //             hs.endMeta,
            //             hs.text,
            //             hs.id
            //         )
            // )
            // auto-highlight selections
            // highlighter.run()
        })
        contentRef.current.addEventListener('click', e => {
            const target = e.target
            if (e.target.tagName === 'span') {
                console.log('target', target)
                // 这里做一些操作。
            }
        })
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const handleClickBtn = key => {
        const h = highlighter.current
        const className = `color-${key}`
        console.log('clssName', className)
        const selection = window.getSelection()
        h.setOption({
            style: {
                className,
            },
        })
        h.fromRange(selection.getRangeAt(0))
    }

    const handleTest = () => {
        const h = highlighter.current

        log(h.getDoms())
    }

    console.log('')
    return (
        <div className={cls}>
            <button onClick={handleTest}>测试</button>
            {Object.keys(annotationColor).map(key => {
                return (
                    <Button key={key} onClick={() => handleClickBtn(key)}>
                        {key}
                    </Button>
                )
            })}
            <div
                ref={contentRef}
                className='content'
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}

export default Annotation
