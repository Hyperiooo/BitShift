var cursors = {
    "crosshair": {
        "img": "./assets/cursors/crosshair.png",
        "width": 7,
        "height": 7,
        "origin": [0.50, 0.50]
    },
    "eyedropper": {
        "img": "./assets/cursors/eyedropper.png",
        "width": 16,
        "height": 16,
        "origin": [0, 1]
    },
    "fillbucket": {
        "img": "./assets/cursors/fillbucket.png",
        "width": 15,
        "height": 15,
        "origin": [0, 1]
    }
}

var curCursor = "eyedropper"

document.onmousemove = e => {
    if (e.target.getAttribute("customcursor") != null) {
        cursor.style.left = e.clientX - (Math.floor(cursors[curCursor].origin[0] * cursors[curCursor].width)) + "px"
        cursor.style.top = e.clientY - (Math.floor(cursors[curCursor].origin[1] * cursors[curCursor].height)) + "px"
    }
}

function updateCursor() {
    document.getElementById("cursorimg").src = cursors[curCursor].img
    cursor.style.width = cursors[curCursor].width + "px"
    cursor.style.height = cursors[curCursor].height + "px"
}

var outlinePoints = [];
var outlineSprayPoints = [];
function createBrushPoints() {
    let brushSize = parseInt(settings.tools.brushSize.value)
    let r = brushSize - 1
    if(brushSize == 1) {
        outlinePoints=[{x:0, y:0}]
        return;
    }
    outlinePoints = ellipse(0, 0, r, r)
}
function createSprayPoints() {
    let spraySize = parseInt(settings.tools.spraySize.value)
    let r = spraySize - 1
    if(spraySize == 1) {
        outlineSprayPoints=[{x:0, y:0}]
        return;
    }
    outlineSprayPoints = ellipse(0, 0, r, r)
}

var cursorCanv = document.getElementById("cursorcanv")
var cursorcanvctx = cursorCanv.getContext('2d')

function drawOutline(a,b) {
    var offX = a - Math.floor(settings.tools.brushSize.value / 2);
    var offY = b - Math.floor(settings.tools.brushSize.value / 2);
    cursorcanvctx.fillStyle = "#fff"
    cursorcanvctx.clearRect(0, 0, cursorCanv.width, cursorCanv.height)
    outlinePoints.forEach(e => {
        var x = Math.floor((e.x + offX) * settings.ui.canvasScale)
        var y = Math.floor((e.y + offY) * settings.ui.canvasScale)
        cursorcanvctx.fillRect(x - 1, y - 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        cursorcanvctx.fillRect(x + 1, y + 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        cursorcanvctx.fillRect(x + 1, y - 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        cursorcanvctx.fillRect(x - 1, y + 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
    })
    var int = 5;
    if(settings.tools.brushSize.value == 1) {
        int = 0
    }
    if(settings.tools.brushSize.value == 3) {
        int = 1
    }
    outlinePoints.forEach(e => {
        var x = Math.floor((e.x + offX) * settings.ui.canvasScale)
        var y = Math.floor((e.y + offY) * settings.ui.canvasScale)
        cursorcanvctx.fillRect(x, y, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        var x2 = x;
        var y2 = y;
        var x22 = Math.round(settings.ui.canvasScale);
        var y22 = Math.round(settings.ui.canvasScale);
        var b = settings.tools.brushSize.value
        if (e.y < b / 2 && e.x < b / 2) {
            y22 += int;
            x22 += int;
        } else if (e.y >= b / 2 && e.x < b / 2) {
            y2 -= int;
            y22 += int;
            x22 += int;
        } else if (e.y < b / 2 && e.x >= b / 2) {
            y22 += int;
            x2 -= int;
            x22 += int;
        } else if (e.y >= b / 2 && e.x > b / 2) {
            y2 -= int;
            y22 += int;
            x2 -= int;
            x22 += int;
        }
        cursorcanvctx.clearRect(x2, y2, x22, y22)

    })

}

function drawSprayOutline(a,b) {
    
    var offX = a - Math.floor(settings.tools.spraySize.value / 2);
    var offY = b - Math.floor(settings.tools.spraySize.value / 2);
    cursorcanvctx.fillStyle = "#fff"
    cursorcanvctx.clearRect(0, 0, cursorCanv.width, cursorCanv.height)
    outlineSprayPoints.forEach(e => {
        var x = Math.floor((e.x + offX) * settings.ui.canvasScale)
        var y = Math.floor((e.y + offY) * settings.ui.canvasScale)
        cursorcanvctx.fillRect(x - 1, y - 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        cursorcanvctx.fillRect(x + 1, y + 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        cursorcanvctx.fillRect(x + 1, y - 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        cursorcanvctx.fillRect(x - 1, y + 1, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
    })
    var int = 5;
    if(settings.tools.spraySize.value == 1) {
        int = 0
    }
    if(settings.tools.spraySize.value == 3) {
        int = 1
    }
    outlineSprayPoints.forEach(e => {
        var x = Math.floor((e.x + offX) * settings.ui.canvasScale)
        var y = Math.floor((e.y + offY) * settings.ui.canvasScale)
        cursorcanvctx.fillRect(x, y, Math.round(settings.ui.canvasScale), Math.round(settings.ui.canvasScale))
        var x2 = x;
        var y2 = y;
        var x22 = Math.round(settings.ui.canvasScale);
        var y22 = Math.round(settings.ui.canvasScale);
        var b = settings.tools.spraySize.value
        if (e.y < b / 2 && e.x < b / 2) {
            y22 += int;
            x22 += int;
        } else if (e.y >= b / 2 && e.x < b / 2) {
            y2 -= int;
            y22 += int;
            x22 += int;
        } else if (e.y < b / 2 && e.x >= b / 2) {
            y22 += int;
            x2 -= int;
            x22 += int;
        } else if (e.y >= b / 2 && e.x > b / 2) {
            y2 -= int;
            y22 += int;
            x2 -= int;
            x22 += int;
        }
        cursorcanvctx.clearRect(x2, y2, x22, y22)

    })
}

var cursor = document.getElementById("cursor")