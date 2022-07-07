var selectionSVG = document.getElementById("selectionSVG")

var selectionPath = [];
var outlinePath = []

function drawOnSelectionSVG(outlinePath, antiPath) {
    selectionSVG.innerHTML = ""
    var svgOffset = 1 / board.canvScale
    var box = document.createElementNS('http://www.w3.org/2000/svg', "path");
    var anti = document.createElementNS('http://www.w3.org/2000/svg', "path");
    var mask = document.createElementNS('http://www.w3.org/2000/svg', "mask");
    mask.setAttributeNS(null, "id", "mask")
        //box.setAttributeNS(null, "d", "M 0 0 H 1 V 1 H 0 Z");
    box.setAttributeNS(null, "d", outlinePath);
    anti.setAttributeNS(null, "d", antiPath);
    box.setAttributeNS(null, "fill", "white")
    anti.setAttributeNS(null, "fill", "black")
    var fill = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    fill.setAttributeNS(null, "x", 0)
    fill.setAttributeNS(null, "y", 0)
    fill.setAttributeNS(null, "width", board.width)
    fill.setAttributeNS(null, "height", board.height)
    fill.setAttributeNS(null, "fill", "white")
    var group = document.createElementNS('http://www.w3.org/2000/svg', "g");
    group.setAttributeNS(null, "mask", "url(#mask)")
    group.appendChild(fill)


    mask.appendChild(box)
    mask.appendChild(anti)
    selectionSVG.appendChild(mask)
    selectionSVG.appendChild(group)
}

function modifySelectionPath(x1, y1, x2, y2, type) {
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
        selectionPath = []
        cliptype = ClipperLib.ClipType.ctUnion

    }
    cpr.AddPaths(selectionPath, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
    var modifiedPaths = new ClipperLib.Paths();
    cpr.Execute(cliptype, modifiedPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
    console.log(JSON.stringify(modifiedPaths))
    selectionPath = modifiedPaths
    drawSelectionPreview()
}

function drawSelectionPreview() {
    outlinePath = []
    selectionPath.forEach(e => {
        var outlinedPath = [
            [],
            [],
            [],
            []
        ]
        console.log(outlinePath)
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
    drawOnSelectionSVG(paths2string(outlinePath), paths2string(selectionPath))
}

function canvasResized() {
    svgOffset = 1 / board.canvScale
    if (isSelected()) {
        drawSelectionPreview()
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