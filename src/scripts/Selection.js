var selectionSVG = document.getElementById("selectionSVG")

var selectionPath = [];
var outlinePath = []
var stripeWidth
var selectionStripeDefs = document.createElementNS('http://www.w3.org/2000/svg', "defs");
var selectionStripePattern = document.createElementNS('http://www.w3.org/2000/svg', "pattern");
var selectionStripePath = document.createElementNS('http://www.w3.org/2000/svg', "path");
var selectionStripeFill = document.createElementNS('http://www.w3.org/2000/svg', "rect");

function createPattern() {
    stripeWidth = 6 / (board ? board.canvScale : 4)
    selectionStripePattern.appendChild(selectionStripeFill)
    selectionStripeFill.setAttributeNS(null, "x", 0)
    selectionStripeFill.setAttributeNS(null, "width", stripeWidth)
    selectionStripeFill.setAttributeNS(null, "y", 0)
    selectionStripeFill.setAttributeNS(null, "height", stripeWidth)
    selectionStripeFill.setAttributeNS(null, "fill", "white")
    selectionStripePattern.setAttributeNS(null, "id", "stripes")
    selectionStripePattern.setAttributeNS(null, "patternUnits", "userSpaceOnUse")
    selectionStripePattern.setAttributeNS(null, "width", stripeWidth)
    selectionStripePattern.setAttributeNS(null, "height", stripeWidth)
    selectionStripePath.setAttributeNS(null, "d", `M 0 0 L ${.25 * stripeWidth} 0 L 0 ${.25 * stripeWidth} M ${.75 * stripeWidth} 0 L 0 ${.75 * stripeWidth} L 0 ${stripeWidth} L ${.25 * stripeWidth} ${stripeWidth} L ${stripeWidth} ${.25 * stripeWidth} L ${stripeWidth} 0 M ${stripeWidth} ${.75 * stripeWidth} L ${.75 * stripeWidth} ${stripeWidth} L ${stripeWidth} ${stripeWidth}`)
    selectionStripePath.setAttributeNS(null, "fill", "black")
    selectionStripePath.setAttributeNS(null, "stroke-width", "10")
    selectionStripePattern.appendChild(selectionStripePath)
    selectionStripeDefs.appendChild(selectionStripePattern)
    selectionSVG.appendChild(selectionStripeDefs)
}

function updatePattern() {
    stripeWidth = 6 / (board ? board.canvScale : 4)
    selectionStripePattern.setAttributeNS(null, "width", stripeWidth)
    selectionStripePattern.setAttributeNS(null, "height", stripeWidth)
    selectionStripePath.setAttributeNS(null, "d", `M 0 0 L ${.25 * stripeWidth} 0 L 0 ${.25 * stripeWidth} M ${.75 * stripeWidth} 0 L 0 ${.75 * stripeWidth} L 0 ${stripeWidth} L ${.25 * stripeWidth} ${stripeWidth} L ${stripeWidth} ${.25 * stripeWidth} L ${stripeWidth} 0 M ${stripeWidth} ${.75 * stripeWidth} L ${.75 * stripeWidth} ${stripeWidth} L ${stripeWidth} ${stripeWidth}`)


}
var selectionMaskBox, selectionMaskAnti, selectionMask, selectionFill



function drawOnSelectionSVG(antiPath) {
    var svgOffset = 1 / board.canvScale

    //updatePattern()
    selectionMaskBox.setAttributeNS(null, "d", antiPath);
    selectionMaskBox.setAttributeNS(null, "stroke", "white")
    selectionMaskBox.setAttributeNS(null, "stroke-width", svgOffset)
    selectionMaskAnti.setAttributeNS(null, "d", antiPath);
    selectionMaskAnti.setAttributeNS(null, "stroke", "black")
    selectionMaskAnti.setAttributeNS(null, "stroke-dasharray", stripeWidth)
    selectionMaskAnti.setAttributeNS(null, "stroke-width", svgOffset)
}

function updateSelectionOutline() {
    selectionMaskBox.setAttributeNS(null, "stroke-width", svgOffset)
    selectionMaskAnti.setAttributeNS(null, "stroke-width", svgOffset)
    selectionMaskAnti.setAttributeNS(null, "stroke-dasharray", stripeWidth)
}
var calledAlready = false

function debounce(callback) {
    if (calledAlready) return
    setTimeout(() => {
        calledAlready = false
    }, 500);
    calledAlready = true
    callback()
}

function modifySelectionPath(x1, y1, x2, y2, type) {
    //updatePattern()
    var modifierPath = [
        [
            { X: x1, Y: y1 },
            { X: x2, Y: y1 },
            { X: x2, Y: y2 },
            { X: x1, Y: y2 }
        ]
    ]
    var cpr = new ClipperLib.Clipper();
    var cliptype
    if (type == "add") {
        cliptype = ClipperLib.ClipType.ctUnion
    } else if (type == "subtract") {
        cliptype = ClipperLib.ClipType.ctDifference

    } else if (type == "replace") {
        cliptype = ClipperLib.ClipType.ctUnion

    }
    cpr.AddPaths(selectionPath, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
    var modifiedPaths = new ClipperLib.Paths();
    cpr.Execute(cliptype, modifiedPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
    selectionPath = modifiedPaths
    drawSelectionPreview()
}

function drawSelectionPreview() {
    console.time("preview")
    outlinePath = []
    selectionPath.forEach(e => {
        var outlinedPath = [
            [],
            [],
            [],
            []
        ]
        e.forEach(x => {
            outlinedPath[0].push({ X: x.X + svgOffset, Y: x.Y + svgOffset })
            outlinedPath[1].push({ X: x.X - svgOffset, Y: x.Y + svgOffset })
            outlinedPath[2].push({ X: x.X + svgOffset, Y: x.Y - svgOffset })
            outlinedPath[3].push({ X: x.X - svgOffset, Y: x.Y - svgOffset })
        })
        outlinedPath.forEach(e => {
            outlinePath.push(e)
        })
    });
    console.timeLog("preview")
    console.timeEnd("preview")
    notify.log(selectionPath.length)
    drawOnSelectionSVG(paths2string(selectionPath))
}

function canvasResized() {
    stripeWidth = 6 / (board ? board.canvScale : 4)
    svgOffset = 1 / board.canvScale
    if (isSelected()) {
        updateSelectionOutline()
    }
}

function paths2string(paths, scale) {
    var svgpath = "",
        i, j;
    if (!scale) scale = 1;
    for (i = 0; i < paths.length; i++) {
        for (j = 0; j < paths[i].length; j++) {
            if (!j) svgpath += "M";
            else svgpath += "L";
            svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
        }
        svgpath += "Z";
    }
    if (svgpath == "") svgpath = "M0,0";
    return svgpath;
}

function isSelected() {
    return selectionPath.length != 0
}

function setUpSelectionSVG() {
    //createPattern()
    selectionMaskBox = document.createElementNS('http://www.w3.org/2000/svg', "path");
    selectionMaskAnti = document.createElementNS('http://www.w3.org/2000/svg', "path");
    selectionMaskBox.setAttributeNS(null, "id", "selectionMaskContent")
    selectionMaskAnti.setAttributeNS(null, "id", "selectionMaskSubtract")
    selectionMaskBox.setAttributeNS(null, "fill", "#0000")
    selectionMaskAnti.setAttributeNS(null, "fill", "#0000")
    selectionMask = document.createElementNS('http://www.w3.org/2000/svg', "mask");
    selectionMask.setAttributeNS(null, "id", "selectMask")
    selectionFill = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    var group = document.createElementNS('http://www.w3.org/2000/svg', "g");
    //group.setAttributeNS(null, "mask", "url(#selectMask)")
    //group.appendChild(selectionFill)
    selectionFill.setAttributeNS(null, "x", -stripeWidth)
    selectionFill.setAttributeNS(null, "y", -stripeWidth)
    selectionFill.setAttributeNS(null, "width", board.width + stripeWidth)
    selectionFill.setAttributeNS(null, "height", board.height + stripeWidth)
    selectionFill.setAttributeNS(null, "fill", "url(#stripes)")

    group.appendChild(selectionMaskBox)
    group.appendChild(selectionMaskAnti)
        //selectionSVG.appendChild(selectionMask)
    selectionSVG.appendChild(group)
    requestAnimationFrame(stripeAnimation)
}
var stripeOffset = 0
var previousElapsed

function stripeAnimation(elapsed) {
    stripeOffset += .5 / board.canvScale

    selectionMaskAnti.setAttributeNS(null, "stroke-dashoffset", stripeOffset)
    requestAnimationFrame(stripeAnimation)
}