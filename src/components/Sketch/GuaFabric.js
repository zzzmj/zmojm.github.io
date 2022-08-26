import { fabric } from 'fabric'

class GuaFabric {
    constructor(canvasDom) {
        const canvas = new fabric.Canvas(canvasDom, {
            isDrawingMode: true,
            width: document.body.clientWidth,
            height: document.body.clientHeight,
        })
        // 历史队列
        this.past = []
        // 未来队列
        this.future = []
        this.canvas = canvas
        this.canvas.freeDrawingBrush.width = 4
        this.canvas.freeDrawingBrush.color = '#ff4d4f'
        canvas.on('mouse:up', () => {
            const state = canvas.toDatalessJSON()
            this.past.push(state)
            this.future = []
        })
    }

    // 撤销
    undo() {
        const { past, future } = this
        if (past.length <= 0) return
        const previous = past[past.length - 1]
        // 历史队列-1
        this.past = past.slice(0, past.length - 1)
        // 未来队列+1
        this.future = [previous, ...future]
        if (this.past.length === 0) {
            this.canvas.loadFromJSON({})
        } else {
            this.canvas.loadFromJSON(this.past[this.past.length - 1])
        }
    }

    // 重做
    redo() {
        if (this.future.length <= 0) return
        const current = this.future[0]
        // 历史队列 + 1
        this.past = [...this.past, current]
        // 未来队列+1
        this.future = this.future.slice(1)
        this.canvas.loadFromJSON(current)
    }

    clear() {
        this.canvas.clear()
        this.canvas.remove(this.canvas.getObjects())
        this.past = []
        this.future = []
    }
}

export default GuaFabric
