window.onload = function() {
function Tablet(domId, options){
    this.canvas = document.querySelectorAll(domId)[0]
    this.cxt = this.canvas.getContext('2d')
    this.options = Object.assign(
        {"height": 660,  //canvas高度
         "width": 660,  // canvas宽度
         "lineWidth": 25,  // 写字笔画宽度
         "strokeStyle": 'black', // 默认写字颜色
         "borderWidth": 4 // canvas边框
        }, options)
    this.cxt.lastLineWidth = ''
    this.ismouseDown = false
    this.lastLoc = {x: 0, y: 0} // 上一次鼠标位置
    this.lastTimestamp = '' // 上一次鼠标毫秒
    this.init()
}


Tablet.prototype = {
    init: function() {
        this.canvas.height = this.canvas.width = Math.min(this.options.width, window.screen.width - 20)
        this.drawGrid()
        this.bindEvent()
    },
    drawGrid: function() {
        var cxt = this.cxt
        var borW = this.options.borderWidth
        cxt.save() // 保存原始状态
        cxt.strokeStyle = 'rgb(230, 11, 9)'
        cxt.beginPath()
        // 画边框
        cxt.moveTo(borW / 2, borW / 2)
        cxt.lineTo(canvas.width - borW / 2, borW / 2)
        cxt.lineTo(canvas.width - borW / 2, canvas.height - borW / 2)
        cxt.lineTo(borW / 2, canvas.height - borW / 2)
        cxt.closePath()
        cxt.lineWidth = borW
        cxt.stroke()
        // 画米字格
        cxt.beginPath()
        cxt.lineWidth = 1
        // 画4条交叉的虚线 
        cxt.dashedLineTo(borW / 2, borW / 2,canvas.width - borW / 2, canvas.height - borW / 2)
        cxt.dashedLineTo(borW / 2, canvas.height - borW / 2, canvas.width - borW / 2, borW / 2)
        cxt.dashedLineTo(borW / 2, canvas.height / 2, canvas.width, canvas.height / 2)
        cxt.dashedLineTo(canvas.width / 2, borW / 2, canvas.width / 2, canvas.height)

        cxt.stroke()
        cxt.closePath()
        cxt.restore() // 恢复原始状态
    },
    clearRect: function() {
        var cavs = this.canvas
        this.cxt.clearRect(0, 0, cavs.width, cavs.height)
        this.drawGrid()
    },
    calcDistance: function(loc1, loc2) { // 前后两点间的路程
        return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) 
            + (loc1.y - loc2.y) * (loc1.y - loc2.y))
    },
    windowToCanvas: function(x, y) {
        var bbox = this.canvas.getBoundingClientRect()
        return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)}
    },
    // 根据画笔的速度来求笔的线宽 参数是速度 和 时间
    calcLineWidth: function(t, s) {
        var maxV = 10
        var minV = 0.1
        var v = s / t
        console.log(v)
        var resultLineWidth, realLineWith = (window.screen.width >= 768 ? this.options.lineWidth : 20)
        if (v <= minV) resultLineWidth = realLineWith
        else if (v >= maxV) resultLineWidth = 1
        else
            resultLineWidth = realLineWith - (v-minV) / (maxV - minV) * (realLineWith - 1)
        if (!this.cxt.lastLineWidth) {
            return resultLineWidth
        }
        // 上一次的宽度保留2/5, 本次宽度取3/5
        return this.cxt.lastLineWidth * 3/5 + resultLineWidth * 2/5
    },
    beginStroke: function(point){
        this.ismouseDown = true
        this.lastLoc = this.windowToCanvas(point.x, point.y)
        this.lastTimestamp = Date.now()
    },
    moveStroke: function(point){
        var lastLoc = this.lastLoc
        var currLoc = this.windowToCanvas(point.x, point.y) // 当前毫秒
        var currTimestamp = Date.now() // 当前鼠标位置
        var cxt = this.cxt
        // 绘制前一点后一点所用的时间和距离来求速度
        var t = currTimestamp - this.lastTimestamp
        var s = this.calcDistance(currLoc, lastLoc)
        var lineWidth = this.calcLineWidth(t, s)
        // 绘制点过程
        cxt.lineWidth = lineWidth
        cxt.strokeStyle = this.options.strokeStyle
        cxt.beginPath()
        cxt.lineCap = 'round'
        cxt.lineJoin = 'round'
        cxt.moveTo(lastLoc.x, lastLoc.y)
        cxt.lineTo(currLoc.x, currLoc.y)
        cxt.stroke()
        cxt.closePath()
        // 重置结束点信息
        this.lastLoc = currLoc
        this.lastTimestamp = currTimestamp
        this.cxt.lastLineWidth = lineWidth
    },
    endStroke: function(){
        this.ismouseDown = false
    },
    bindEvent: function() {
        var cavs = this.canvas
        var that = this
        cavs.onmousedown = function(e){
            e.preventDefault()
            console.log('that.ismouseDown', that.windowToCanvas(e.clientX, e.clientY))
            that.beginStroke({x: e.clientX, y: e.clientY})
        }
        cavs.onmousemove = function(e){
            e.preventDefault()
            var cxt = that.cxt
            if (that.ismouseDown) {
                that.moveStroke({x: e.clientX, y: e.clientY})
            }
        }
        cavs.onmouseup = function(e){
            e.preventDefault()
            that.endStroke()
            console.log('ismouse  up up')
        }
        cavs.onmouseout = function(e){
            e.preventDefault()
            that.endStroke()
        }
        cavs.addEventListener('touchstart', function(e){
            e.preventDefault()
            var touch = e.touches[0]
            that.beginStroke({x: touch.pageX, y: touch.pageY})
        })
        cavs.addEventListener('touchmove', function(e){
            e.preventDefault()
            var touch = e.touches[0]
            that.moveStroke({x: touch.pageX, y: touch.pageY})
        })
        cavs.addEventListener('touchend', function(e){
            e.preventDefault()
            that.endStroke()
            console.log('ismouse touchend up')
        })
    },

}

    function $(s){
        return document.querySelectorAll(s)
    }
    var Tablet = new Tablet('#canvas', {width: 640, lineWidth: 30,"strokeStyle": 'black'})
    var clearBtn = $('#clearBtn')[0]
    var colors = $('.color')
    clearBtn.onclick = function() {
        Tablet.clearRect()
    }
    for (var i = colors.length - 1; i >= 0; i--) {
        colors[i].onclick = function(e){
            var co = this.getAttribute("data-co")
            // this.style.backgroundColor = co 
            handlerColor()
            this.className = 'color selected ' + co
            Tablet.options.strokeStyle = co
        }
    }
    function handlerColor(){
        for (var j = colors.length - 1; j >= 0; j--) {
            var cor = colors[j].getAttribute("data-co")
            colors[j].className = "color "+ cor
        }
    }

    var imgBtn = $('#imgBtn')[0]
    var closeBtn = $('#closeBtn')[0]
    var imgBox = $('#imgBox')[0]
    var img
    imgBtn.onclick = function(){
        img = new Image
        img.onload = function(){
            imgBox.appendChild(img)
            imgBox.style.display = 'block'
        }
        img.src = Tablet.canvas.toDataURL()
    }
    imgBox.onclick = function(){
        imgBox.style.display = 'none'
        imgBox.removeChild(img)
    }
    closeBtn.onclick = function(e){
        e.stopPropagation()
        imgBox.style.display = 'none'
        imgBox.removeChild(img)
    }
    if(window.screen.height >= 768 && window.screen.width > 1024) {
        alert('温馨提示：如果方格不能在屏幕中完全展示,请按F11全屏')
    }
}

CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
    // default interval distance -> 5px
    if (typeof pattern === "undefined") {
        pattern = 5;
    }
    // calculate the delta x and delta y
    var dx = (toX - fromX);
    var dy = (toY - fromY);
    var distance = Math.floor(Math.sqrt(dx*dx + dy*dy));
    var dashlineInteveral = (pattern <= 0) ? distance : (distance/pattern);
    var deltay = (dy/distance) * pattern;
    var deltax = (dx/distance) * pattern;

    // draw dash line
    this.beginPath();
    for(var dl=0; dl< dashlineInteveral; dl++) {
        if(dl%2) {
            this.lineTo(fromX + dl*deltax, fromY + dl*deltay);
        } else {
            this.moveTo(fromX + dl*deltax, fromY + dl*deltay);
        }
    }
    this.stroke();  
};