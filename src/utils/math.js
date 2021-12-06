export const getNumberFromLen = numberLength => {
    const n = parseInt(Math.random() * Math.pow(10, numberLength))
    if (n !== 0) {
        return n
    } else {
        return getNumberFromLen(numberLength)
    }
}

// number是数字，len是保留的位数，并且放大到的位数
// 例如
// formatAnswerNumber(0.03813, 2) => 38
// formatAnswerNumber(0.03813, 3) => 381
export const formatAnswerNumber = (number, len) => {
    let n = number
    if (n > 100) n /= 10
    while (n < Math.pow(10, len - 1)) {
        n *= 10
    }
    return Math.round(n)
}
