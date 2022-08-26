// 点栈
class PointQueue {
    constructor() {
        this.arr = []
    }

    push(item) {
        this.arr.push(item)
        if (this.arr.length > 3) {
            this.arr.shift()
        }
    }

    get() {
        return [this.arr[0], this.arr[1], this.arr[2]]
    }
}
export default PointQueue
