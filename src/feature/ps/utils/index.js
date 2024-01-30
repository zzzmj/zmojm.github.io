export function splitLength(length, segments) {
    const segmentLength = length / segments // 每段长度
    const result = [] // 存储每段长度坐标的数组

    for (let i = 1; i < segments; i++) {
        const segmentStart = (i * segmentLength).toFixed(1) // 每段的起始坐标
        result.push(segmentStart) // 将每段的起始坐标存入数组
    }

    return result
}

// 根据容器宽高调整img的宽高，通过scale缩放
export function getImgScale({ wrapWidth, wrapHeight, imgWidth, imgHeight }) {
    const w = imgWidth
    const h = imgHeight
    const cw = wrapWidth
    const ch = wrapHeight
    console.log('scale', w, h, cw, ch)
    // 自动根据容器宽高调整img的宽高，算法是具有10%-100%一共九个比例，依次使用这几个比例，
    // [1, 0.9, 0.8, ..., 0.1]
    let scale = 0.1
    const scaleList = new Array(10)
        .fill('')
        .map((item, index) => (10 - index) / 10)
    for (let i = 0; i < scaleList.length; i++) {
        const s = scaleList[i]
        // console.log('heh', s, w * s, h * s, cw, ch)
        if (w * s < cw && h * s < ch) {
            scale = s
            break
        }
    }
    return scale
}
