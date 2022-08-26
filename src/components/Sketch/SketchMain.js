import PointQueue from './PointQueue'

class SketchMain {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.point = new PointQueue()
        this.ctx.lineWidth = 3
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        this.initEvent()
    }
    log = () => {
        console.log('this.point', this.point)
    }
    mouseDown = e => {
        this.paint = true
        this.ctx.beginPath()
        this.point.push({
            x: e.offsetX,
            y: e.offsetY,
        })
    }
    mouseUp = e => {
        this.paint = false
        this.ctx.closePath()
        this.point.push({
            x: e.offsetX,
            y: e.offsetY,
        })
    }
    mouseMove = e => {
        this.point.push({
            x: e.offsetX,
            y: e.offsetY,
        })
    }
    initEvent() {
        this.canvas.addEventListener('mousedown', this.mouseDown)
        this.canvas.addEventListener('touchstart', this.mouseDown)
        this.canvas.addEventListener('mouseup', this.mouseUp)
        this.canvas.addEventListener('touchend', this.mouseUp)
        this.canvas.addEventListener('mousemove', this.mouseMove)
        this.canvas.addEventListener('touchmove', this.touchmove)
    }
    drawLine(point1, point2, point3) {
        this.ctx.lineTo(point1.x, point1.y)
        const cx = (point1.x + point3.x) / 2
        const cy = (point1.y + point3.y) / 2
        this.ctx.quadraticCurveTo(cx, cy, point3.x, point3.y)
        this.ctx.stroke()
    }
    runloop() {
        // 用requestAnimationFrame优化setInterval
        const draw = () => {
            const point = this.point.get()
            if (this.paint && point[2]) {
                console.log('point', point)
                this.drawLine(point[0], point[1], point[2])
            }
            requestAnimationFrame(draw)
        }
        requestAnimationFrame(draw)
    }
}

export default SketchMain
