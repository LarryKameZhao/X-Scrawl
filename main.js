let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
setCanvasSize(canvas)
listenToMouse(canvas)
function drawCircle(x, y, radius) {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}
function drawLine(x1, y1, x2, y2, width) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineWidth = width
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}
function setCanvasSize(cavas) {
    function setHeightAndWidth() {
        let pageWidth = document.documentElement.clientWidth
        let pageHeight = document.documentElement.clientHeight
        canvas.width = pageWidth
        canvas.height = pageHeight
    }
    setHeightAndWidth()
    window.onresize = function () {
        setHeightAndWidth(canvas)
    }
}
function listenToMouse(canvas) {

    let painting = false
    let lastPoint = {
        x: undefined,
        y: undefined
    }
    canvas.onmousedown = function (a) {
        let x = a.clientX
        let y = a.clientY
        if (usingEraser) {
            context.clearRect(x - 5, y - 5, 10, 10)
        } else {
            painting = true
            lastPoint = { x, y }
        }
    }
    canvas.onmousemove = function (a) {
        let x = a.clientX
        let y = a.clientY
        if (usingEraser) {
            context.clearRect(x - 5, y - 5, 10, 10)
        } else {
            if (painting) {
                let newPoint = { x, y }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, 10)
                lastPoint = newPoint
            }
        }
    }
    canvas.onmouseup = function (a) {
        painting = false
    }
}
let usingEraser = false
let eraser = document.getElementById('eraser')
eraser.onclick = function () {
    usingEraser = true
    actions.className = 'actions x'
}
brush.onclick = function () {
    usingEraser = false
    actions.className = 'actions'
}