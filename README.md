## X-Scrawl涂鸦
### [预览链接](https://yuyunzhi.github.io/music-2018-06/src/index.html,"预览链接")

![项目截图](https://music164.oss-cn-hangzhou.aliyuncs.com/markdown/QQ%E6%B5%8F%E8%A7%88%E5%99%A8%E6%88%AA%E5%9B%BE20181023120034.png)

关键词： JQuery, canvas, html5
描述：使用canvas的api和javaScript的相关事件进行绘图，支持画笔（包括颜色，粗细调节），橡皮擦，下载到本地，一键清空功能，同时支持移动端涂鸦。

### 项目实现

#### 设置画板
~~~
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
~~~
我们默认设置的尺寸是客户端的clientWidth和clientHeight,通过监听window.onresize事件后执行重置画板操作。
#### 绘图功能主要通过drawLine函数进行实现，如下代码：
~~~
  function drawLine(x1, y1, x2, y2, width) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineWidth = width
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}
~~~
通过接收两个点的x和y坐标，以及线的粗细，通过设置canvas的lineTo和lineWidth来进行线条的绘制。

#### 判断客户端类型
~~~
if (document.body.ontouchstart !== undefined) {
        canvas.ontouchstart = function (a) {
            let x = a.touches[0].clientX
            let y = a.touches[0].clientY
            painting = true
            if (usingEraser) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                painting = true
                lastPoint = { x, y }
            }
        }
       ......
       }
~~~
如果document.body.ontouchstart不为undefiend说明客户端是移动端，则监听移动端的一些事件，否则监听PC端的事件。本项目中主要区别在PC端有鼠标事件，移动端有touch事件。

#### 绘图过程
##### 画笔功能：
传入一个paiting变量，判断能否绘图（当能用橡皮时为false），按下鼠标是，canvas的点移动到鼠标点击处（此处为绘图起点），然后进行绘图，直到监听到mouseUp事件，结束绘图。mouseMove时，要将鼠标拖动到的新的点，替换掉原来的点。这样才能进行不停的绘图。
~~~
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
                //将鼠标移动到的新点，替换原来的点
            }
        }
        canvas.onmouseup = function (a) {
            painting = false
            usingEraser = false
        }
~~~
#### 橡皮擦功能：
当usingEraser为true时可用。使用canvas.clearRect将画板上的内容清除。
~~~
 context.clearRect(x - 5, y - 5, 10, 10)
~~~
#### 保存功能
将canvas画好的内容转化为base64 编码的 dataURL。如果直接将画板内容下载下来，当内容颜色时黑色时就不可见。这时，我们需要创建一张带背景色的画布（默认白色），然后将我们在画板中画的内容，输出到这样画板，这样保存下来就有背景色了。
~~~
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
~~~
![保存图片效果](https://music164.oss-cn-hangzhou.aliyuncs.com/markdown/%E9%A1%B9%E7%9B%AE%E4%BF%9D%E5%AD%98.png)

#### 按钮
按钮logo主要通过symbol引入。
#### 移动端点击延迟
当移动端访问时，通过触摸绘图，我们会发现有延迟。这样体验效果非常糟糕，由于300ms触摸延迟的存在。我们通过引入FastClick来解决这个问题。
~~~
$(function() {
            FastClick.attach(document.body);
        });
~~~
这样，绘图就变得流畅了，移动端的体验更好了。
