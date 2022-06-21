var cursors = {
    "crosshair": {
        "img": "assets/cursors/crosshair.png",
        "width": 7,
        "height": 7,
        "origin": [0.50, 0.50]
    },
    "eyedropper": {
        "img": "assets/cursors/eyedropper.png",
        "width": 16,
        "height": 16,
        "origin": [0, 1]
    },
    "fillbucket": {
        "img": "assets/cursors/fillbucket.png",
        "width": 15,
        "height": 15,
        "origin": [0, 1]
    }
}

var curCursor = "eyedropper"

document.onmousemove = e => {
    if (!e.target.getAttribute) return;
    if (e.target.getAttribute("customcursor") != null) {
        cursor.style.left = e.clientX - (Math.floor(cursors[curCursor].origin[0] * cursors[curCursor].width)) + "px"
        cursor.style.top = e.clientY - (Math.floor(cursors[curCursor].origin[1] * cursors[curCursor].height)) + "px"
    }
}

function updateCursor() {
    document.getElementById("cursor").style.webkitMaskImage = "url(" + cursors[curCursor].img + ")"
    cursor.style.width = cursors[curCursor].width + "px"
    cursor.style.height = cursors[curCursor].height + "px"
}

var cursorCanv = document.getElementById("cursorcanv")
var cursorcanvctx = cursorCanv.getContext('2d')


var eraserBufferCanvas = document.createElement("canvas")
eraserBufferCanvas.id = "eraserBufferCanvas"
var eraserBufferCtx = eraserBufferCanvas.getContext("2d")

function drawEraserPreview(x, y) {
    eraserBufferCanvas.width = project.width
    eraserBufferCanvas.height = project.height
    eraserBufferCtx.clearRect(0, 0, project.width, project.height);
    eraserBufferCtx.fillStyle = "white";
    let brushSize = parseInt(settings.tools.brushSize.value)
    let r = brushSize - 1
    if (Tools.fillBucket) r = 0;
    let c;
    if (brushSize % 2 == 0) {
        c = filledEllipse(x - (r / 2) - .5, y - (r / 2) - .5, x + (r / 2) - .5, y + (r / 2) - .5)
    } else if (brushSize % 2 != 0) {
        c = filledEllipse(x - (r / 2), y - (r / 2), x + (r / 2), y + (r / 2))
    }
    var b;
    for (b of c) { eBufDraw(b) }

    cursorcanvctx.globalCompositeOperation = "source-over"
    cursorcanvctx.fillStyle = "#fff"
    cursorcanvctx.imageSmoothingEnabled = false
    cursorcanvctx.clearRect(0, 0, cursorCanv.width, cursorCanv.height);

    cursorcanvctx.drawImage(eraserBufferCanvas, -1, 1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.drawImage(eraserBufferCanvas, 1, -1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.drawImage(eraserBufferCanvas, -1, -1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.drawImage(eraserBufferCanvas, 1, 1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.globalCompositeOperation = "destination-out"
    cursorcanvctx.drawImage(eraserBufferCanvas, 0, 0, cursorCanv.width, cursorCanv.height)
}


function drawSprayPreview(x, y) {
    eraserBufferCanvas.width = project.width
    eraserBufferCanvas.height = project.height
    eraserBufferCtx.clearRect(0, 0, project.width, project.height);
    eraserBufferCtx.fillStyle = "white";
    let brushSize = parseInt(settings.tools.spraySize.value)
    let r = brushSize - 1
    if (Tools.fillBucket) r = 0;
    let c;
    if (brushSize % 2 == 0) {
        c = filledEllipse(x - (r / 2) - .5, y - (r / 2) - .5, x + (r / 2) - .5, y + (r / 2) - .5)
    } else if (brushSize % 2 != 0) {
        c = filledEllipse(x - (r / 2), y - (r / 2), x + (r / 2), y + (r / 2))
    }
    var b;
    for (b of c) { eBufDraw(b) }

    cursorcanvctx.globalCompositeOperation = "source-over"
    cursorcanvctx.fillStyle = "#fff"
    cursorcanvctx.imageSmoothingEnabled = false
    cursorcanvctx.clearRect(0, 0, cursorCanv.width, cursorCanv.height);

    cursorcanvctx.drawImage(eraserBufferCanvas, -1, 1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.drawImage(eraserBufferCanvas, 1, -1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.drawImage(eraserBufferCanvas, -1, -1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.drawImage(eraserBufferCanvas, 1, 1, cursorCanv.width, cursorCanv.height)
    cursorcanvctx.globalCompositeOperation = "destination-out"
    cursorcanvctx.drawImage(eraserBufferCanvas, 0, 0, cursorCanv.width, cursorCanv.height)
}

function eBufDraw(coord) {
    eraserBufferCtx.globalCompositeOperation = 'source-over'
    if (coord.constructor.name == "Point") {
        var x = coord.x
        var y = coord.y
        eraserBufferCtx.fillRect(x, y, 1, 1);
    } else if (coord.constructor.name == "Rect") {
        var x1 = coord.x1
        var y1 = coord.y1
        var x2 = coord.x2
        var y2 = coord.y2
        var ax1, ax2, ay1, ay2
        if (x1 >= x2) {
            ax1 = x2
            ax2 = x1
        } else if (x1 < x2) {
            ax1 = x1
            ax2 = x2
        }
        if (y1 >= y2) {
            ay1 = y2
            ay2 = y1
        } else if (y1 < y2) {
            ay1 = y1
            ay2 = y2
        }
        if (ay2 - ay1 == 0) ay2 = ay1 + 1
        eraserBufferCtx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
    }
}

var cursor = document.getElementById("cursor")