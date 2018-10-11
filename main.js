let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
let lineWidth = 3
setCanvasSize(canvas)
listenToUser(canvas)
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
function listenToUser(canvas) {

    let painting = false
    let lastPoint = {
        x: undefined,
        y: undefined
    }
    if (document.body.ontouchstart !== undefined) {
        canvas.ontouchstart = function (a) {
            let x = a.touches[0].clientX
            let y = a.touched[0].clientY
            painting = true
            if (usingEraser) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                painting = true
                lastPoint = { x, y }
            }
        }
        canvas.ontouchmove = function (a) {
            let x = a.touches[0].clientX
            let y = a.touches[0].clientY
            if (!painting) { return }
            if (usingEraser) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                
                let newPoint = { x, y }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, lineWidth)
                lastPoint = newPoint
                
            }
        }
        canvas.ontouchend = function (a) {
            painting = false
           
        }
    }
    else {
        canvas.onmousedown = function (a) {
            let x = a.clientX
            let y = a.clientY
            painting = true
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
            if (!painting) { return }
            if (usingEraser) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                
                let newPoint = { x, y }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, lineWidth)
                lastPoint = newPoint
                
            }
        }
        canvas.onmouseup = function (a) {
            painting = false
            usingEraser = false
        }
    }
    
}
let usingEraser = false
let eraser = document.getElementById('eraser')
eraser.onclick = function () {
    usingEraser = true
    $(this).addClass('active')
    $(this).siblings().removeClass('active')
}
pencil.onclick = function () {
    usingEraser = false
    $(this).addClass('active')
    $(this).siblings().removeClass('active')
}
clear.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height)
}
save.onclick = function () {
    function canvasToImage(backgroundColor) {
        let w = canvas.width
        let h = canvas.height
        let data
        let compositeOperation = context.globalCompositeOperation
        if (backgroundColor) {
            data = context.getImageData(0, 0, w, h) 
            context.globalCompositeOperation = "destination-over"
            context.fillStyle = backgroundColor;
            context.fillRect(0,0,w,h)
        }
        let imageData = canvas.toDataURL('image/png')
        if (backgroundColor) {
            context.clearRect(0, 0, w, h)
            context.putImageData(data, 0, 0)
            context.globalCompositeOperation = compositeOperation;
        }
        return imageData
    }
    let url = canvasToImage('white')
    console.log(canvasToImage('white'))
    let a = document.createElement('a')
    $('body').append(a)
    a.href = url
    a.download = '我的涂鸦'
    a.target = '_blank'
    a.click()

}
red.onclick = function () {
    red.classList.add('active')
    context.strokeStyle = 'red'
    $(this).siblings().removeClass('active')
}
green.onclick = function () {
    green.classList.add('active')
    context.strokeStyle = 'green' 
    $(this).siblings().removeClass('active')
}
blue.onclick = function () {
    blue.classList.add('active')
    context.strokeStyle = 'blue'
    $(this).siblings().removeClass('active')
}
black.onclick = function () {
    $(black).addClass('active')
    context.strokeStyle = 'black'
    $(this).siblings().removeClass('active')
}
thin.onclick = function () {
    lineWidth = 3
    $(this).addClass('active').siblings().removeClass('active')
}
medium.onclick = function () {
    lineWidth = 6
    $(this).addClass('active').siblings().removeClass('active')
}
thick.onclick = function () {
    lineWidth = 9
    $(this).addClass('active').siblings().removeClass('active')

}