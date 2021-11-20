/**
 * 技术方案构想：
 * 每次编辑后，将html传给服务器即可。
 *
 * UI设计。
 * - 高亮
 * - 标签
 */
import React, { useState } from 'react'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useRef } from 'react'
import Highlighter from 'web-highlighter'
import './Annotation.scss'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
    setHightlightSpanEl,
    getDomByDataId,
    clearHightLight,
} from '../../../utils/index'
import { initAnnotation, createAnnotation } from './AnnotationSlice'
import { useParams } from 'react-router'
import { getArticleFromLeanCloud } from '../../../service/article'

const log = console.log.bind(console, '[annota]')
// 自定义颜色。

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

// 处理中山大学
const processText2 = str => {
    const el = document.createElement('div')
    el.innerHTML = str
    return el.textContent
        .replace(/\n/g, '')
        .replace(/&/g, '')
        .replace(/@/g, '')
        .replace(/([a-zA-Z])\w+/g, '')
        .replace(/<.>/g, '')
        .replace(/<>/g, '')
        .replace(/(\【(.*?)\】)/g, match => {
            return match[1]
        })
        .replaceAll('。', '。</p><p>')
}

// processText(
//     `199508香港.0000705436341504
// “安乐死”是一件[C]不平凡的事情。从不同的角度看这[F這]个问题会有不[C]同的见解和结论。争论的主要焦点在于如何处理好法律与[C]人之常情{CC人事常情}{CQ的}关系。
// 根据严格的法律，我相信法院判的对。既然故意杀人，就有罪。{CP做为[C]清官来[F來]讲[C]，法律应该[F該]是无情的。P}法官会认[C]为如果法律随[F隨]时变动，可妥[C]协的话[F話]，一个国家如何用{CJ+sy执行}法制来[F來]治[B制]理{CJ+by国家}呢？
// {CP可是不幸的是世界上的千变万[C]化，另外人民的人情关系，宗[B崇]教信仰及风俗习惯都具有悠[B攸]久的历史。P}我们[F們]的法律制度不仅不可能提供足够[F夠]的条例[C]来[F來]概括人们[F們]生活中多种多样{CJ+dy发生}的事情，另外在很多方面[L]将与人们[F們]的风俗习惯，崇教信仰发生冲突。
// {CP因此虽然从法律的观[C]点{CQ来看}似乎[B呼]法院的判决是{CD有}符合法律的，可是根据人情的道理，由于他的杀人目[C]的是好意，即为了使他的妻子不再痛苦，法院的判决，说[F說]他故意杀人罪是没有道理{CJsd}[BQ。]P}
// 从以上的两[F兩]个[F個]不同观[C]点{CQ来看}，我觉[C]得评[F評]论[C]“安乐死”事件不能一边倒[C]。我们[F們]不能简单的说[F說]丈夫有罪或无罪，因为我[C]们[F們]既[B即]要讲[C]法律也要讲[C]人情。{CP我觉[C]得最好的方法是调[F調]查当地人们[F們]的意见[F見]，慎重考虑是否在人情的分上，我们[F們]是否应该[F該]这[F這]件做一个明智的决定，即不削[B消]弱法律的作用，又可以照[C]顾[C]人情的道理。P}
// 另外，我[C]们还可以提出，根据“安乐死”事件，修正或更改我们[F們]的法律条例[C]，为以后发生的类似事件提供既{CC又}符合法律又{CC及}符合人情的解[C]决方法。
// `

// 侧边栏
const Annotation = props => {
    const params = useParams()
    const { className, highlighter } = props
    const contentRef = useRef(null)
    const dispatch = useDispatch()
    const [content, setContent] = useState('')
    const categoryList = useSelector(state => state.header.categoryList)
    const annotationList = useSelector(state => state.annotation.annotationList)

    const prefix = 'zz-annotation'
    const cls = classNames({
        [prefix]: true,
        [className]: className,
    })

    useEffect(() => {
        const { objectId } = params
        getArticleFromLeanCloud(objectId).then(article => {
            const articleObj = article.toJSON()
            const list = articleObj.annotation
            console.log('articleoBJ', articleObj)
            let con = ''
            if (articleObj.source === 'SYSU') {
                con = processText2(articleObj.article)
            } else {
                con = processText(articleObj.article)
            }
            setContent(con)
            // 初始化标注状态
            dispatch(initAnnotation(articleObj))
            if (list) {
                // 还原DOM
                list.forEach(item => {
                    highlighter.fromStore(
                        item.start,
                        item.end,
                        item.text,
                        item.id
                    )
                })
            }
        })
    }, [params])

    useEffect(() => {
        // 往里面添加
        if (annotationList.length < 0) return

        // 清空画布
        clearHightLight(contentRef.current)
        // 通过配置项id去找配置项
        const getCategoryConfigById = categoryId => {
            return categoryList.find(item => item.id === categoryId)
        }

        for (let i = 0; i < annotationList.length; i++) {
            const { id, categoryId } = annotationList[i]
            const els = getDomByDataId(id)
            // 拿出config的配置
            const config = getCategoryConfigById(categoryId)
            if (config) {
                const { text, color } = config
                setHightlightSpanEl(els, {
                    text,
                    color,
                })
            }
        }
    }, [annotationList, categoryList])

    useEffect(() => {
        if (!highlighter) return
        const h = highlighter

        h.on(Highlighter.event.CREATE, function (option) {
            const { sources } = option
            // log('这是被创建成功之后data', sources, sources.id)
            sources.map(hs => {
                const obj = {
                    start: hs.start || hs.startMeta,
                    end: hs.end || hs.endMeta,
                    text: hs.text,
                    id: hs.id,
                    categoryId: hs.categoryId || window.categoryId,
                    config: Object.assign(hs.config || {}, window.config),
                }
                dispatch(createAnnotation(obj))
            })
        })
            // .on(Highlighter.event.CLICK, ({ id }) => {})
            .on(Highlighter.event.HOVER, ({ id }) => {
                h.addClass('highlight-wrap-hover', id)
            })
            .on(Highlighter.event.HOVER_OUT, ({ id }) => {
                h.removeClass('highlight-wrap-hover', id)
            })

        // highlighter.current.run()
    }, [])

    useEffect(() => {
        contentRef.current.addEventListener('click', e => {
            const target = e.target
            if (target.tagName === 'span') {
                // 这里做一些操作。
            }
        })
        // return () => {

        // }
    }, [])

    const handleClickBtn = config => {
        const { id, color } = config

        // 将配置id存在window对象中
        window.categoryId = id
        const h = highlighter
        const className = `color-${color}`
        const selection = window.getSelection()
        h.setOption({
            style: {
                className,
            },
        })
        h.fromRange(selection.getRangeAt(0))
    }

    return (
        <div className={cls}>
            <div className='action'>
                {categoryList.map(item => {
                    const { color, text } = item
                    return (
                        <Button
                            key={color}
                            onClick={() => handleClickBtn(item)}
                        >
                            {text}
                        </Button>
                    )
                })}
            </div>
            <div
                id='iloveyryr'
                ref={contentRef}
                // key={Date.now()}
                className='content'
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}

export default Annotation
