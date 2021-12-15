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
import { Button, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
    setHightlightSpanEl,
    getDomByDataId,
    clearHightLight,
} from '../../../utils/index'
import {
    initAnnotation,
    createAnnotation,
    updateSavaStatus,
} from './AnnotationSlice'
import { Prompt, useHistory, useParams } from 'react-router'
import { getArticleFromLeanCloud } from '../../../service/article'

const log = console.log.bind(console, '[annota]')
// 自定义颜色。
const keyCodeList = '123456789ABCDEFGHIJKLMNOPQRSTVWXYZ'
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
    return (
        el.textContent
            .replace(/\n/g, '')
            .replace(/&/g, '')
            .replace(/@/g, '')
            // .replace(/([a-zA-Z])\w+/g, '')
            .replace(/<.>/g, '')
            .replace(/CZ|BZ|SBZ|BGFZ/g, '')
            .replace(/<>/g, '')
            .replace(/(【(.*?)】)/g, match => {
                return match[1]
            })
            .replaceAll('。', '。</p><p>')
    )
}

// 侧边栏
const Annotation = props => {
    const params = useParams()
    const { className, highlighter } = props
    const contentRef = useRef(null)
    const dispatch = useDispatch()
    const [content, setContent] = useState('')
    const [articleList, setArticleList] = useState([])
    const [pager, setPager] = useState({})
    const categoryList = useSelector(state => state.header.categoryList)
    const annotationList = useSelector(state => state.annotation.annotationList)
    const isSave = useSelector(state => state.annotation.isSave)

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
    }, [params, highlighter])

    useEffect(() => {
        const { objectId } = params
        getArticleFromLeanCloud().then(
            res => {
                const data = res.map((item, index) => {
                    return {
                        objectId: item.id,
                        No: index + 1,
                        ...item.toJSON(),
                    }
                })
                setArticleList(data)
                const index = data.findIndex(item => item.objectId === objectId)
                setPager({
                    index: index + 1,
                    length: data.length,
                })
            },
            () => {
                message.error('获取文章失败')
            }
        )
    }, [params])

    useEffect(() => {
        const keyDownFn = event => {
            const keyCode = event.keyCode
            if (keyCode && !window.event.ctrlKey) {
                const char = String.fromCharCode(keyCode)
                const index = keyCodeList.indexOf(char)
                if (index != -1 && index < categoryList.length) {
                    const category = categoryList[index]
                    handleClickBtn(category)
                }
            }
        }
        window.addEventListener('keydown', keyDownFn)

        return () => {
            window.removeEventListener('keydown', keyDownFn)
        }
    }, [categoryList])

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
    }, [highlighter])

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

    useEffect(() => {
        const listener = e => {
            e.preventDefault()
            if (isSave) {
                e.returnValue = '您的数据尚未保存，离开后会丢失'
            } else {
                e.returnValue = ''
            }
        }
        isSave && window.addEventListener('beforeunload', listener)
        return () => {
            window.removeEventListener('beforeunload', listener)
        }
    }, [isSave])

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

        dispatch(updateSavaStatus(true))
    }

    const handleNavigate = type => {
        const { objectId } = params
        let index = articleList.findIndex(item => item.objectId === objectId)
        if (type === 'pre') {
            index -= 1
        } else if (type === 'next') {
            index += 1
        }
        if (index >= 0 && index < articleList.length) {
            if (!isSave) {
                const data = articleList[index]
                const url = new URL(window.location.href)
                url.hash = `#/edit/${data.objectId}`
                window.location.href = url.href
            } else {
                message.error('文章忘记保存了，保存一下')
            }
        } else {
            message.error('已经是第一篇文章或最后一篇文章了，不能再跳转了')
        }
    }

    console.log('isSave', isSave)
    return (
        <div className={cls}>
            <div className='action'>
                {categoryList.map((item, index) => {
                    const { color, text } = item
                    return (
                        <Button
                            key={index}
                            onClick={() => handleClickBtn(item)}
                        >
                            {keyCodeList[index]}：{text}
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

            <Prompt when={isSave} message='您的内容尚未保存确定要离开吗?' />

            <div className='action'>
                <Button onClick={() => handleNavigate('pre')}>上一篇</Button>
                <Button onClick={() => handleNavigate('next')}>下一篇</Button>

                <span>{`${pager.index} / ${pager.length}`}</span>
            </div>
        </div>
    )
}

export default Annotation
