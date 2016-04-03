    function $(s){
        return document.querySelectorAll(s)
    }
    // 创建一个写字板实例对象
    var Tablet = new Tablet(document.querySelectorAll('#canvas')[0], {width: 640, lineWidth: 30,"strokeStyle": 'black'})
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
