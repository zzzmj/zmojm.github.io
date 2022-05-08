export const getNumberFromLen = numberLength => {
    var num = Math.random()
    while (num < Math.pow(10, numberLength - 1)) {
        num *= 10
    }
    return parseInt(num)
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
    return parseInt(n)
}
