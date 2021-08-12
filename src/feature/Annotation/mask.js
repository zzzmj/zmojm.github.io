class Mark {
    constructor() {
        const range = window.getSelection().getRangeAt(0)
        const start = {
            node: range.startContainer,
            offset: range.startOffset,
        }
        const end = {
            node: range.endContainer,
            offset: range.endOffset,
        }
        this.start = start
        this.end = end
    }
    getSelectedNodes = () => {
        const sEl = this.startNode.node
        const eEl = this.endNode.node
        const sOffset = this.startNode.offset
        const eOffset = this.endNode.offset
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

    addHighLight = node => {
        const wrap = document.createElement('span')
        wrap.setAttribute('class', 'highlight')
        wrap.appendChild(node.cloneNode(false))
        console.log('wrap', wrap, node.parentNode)
        node.parentNode.replaceChild(wrap, node)
    }
}

export default Mark
