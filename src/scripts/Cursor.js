var cursors = {
	crosshair: {
		img: "assets/cursors/crosshair.png",
		width: 7,
		height: 7,
		origin: [0.5, 0.5],
	},
	eyedropper: {
		img: "assets/cursors/eyedropper.png",
		width: 16,
		height: 16,
		origin: [0, 1],
	},
	fillbucket: {
		img: "assets/cursors/fillbucket.png",
		width: 15,
		height: 15,
		origin: [0, 1],
	},
};

var curCursor = "eyedropper";

document.onmousemove = (e) => {
	if (!e.target.getAttribute) return;
	cursor.style.left =
		e.clientX -
		Math.floor(cursors[curCursor].origin[0] * cursors[curCursor].width) +
		"px";
	cursor.style.top =
		e.clientY -
		Math.floor(cursors[curCursor].origin[1] * cursors[curCursor].height) +
		"px";
	if (e.target.getAttribute("customcursor") == null) {
		cursor.style.display = "none";
	} else {
		cursor.style.display = "block";
	}
};

function updateCursor() {
	document.getElementById("cursor").style.webkitMaskImage =
		"url(" + cursors[curCursor].img + ")";
	cursor.style.width = cursors[curCursor].width + "px";
	cursor.style.height = cursors[curCursor].height + "px";
}

var cursorSVG = document.getElementById("cursorSVG");

var eraserBufferCanvas = document.createElement("canvas");
eraserBufferCanvas.id = "eraserBufferCanvas";
var eraserBufferCtx = eraserBufferCanvas.getContext("2d");

function drawOnSVGCanvas(outlinePath, antiPath) {
	cursorSVG.innerHTML = "";
	var svgOffset = 1 / board.canvScale;
	var box = document.createElementNS("http://www.w3.org/2000/svg", "path");
	var anti = document.createElementNS("http://www.w3.org/2000/svg", "path");
	var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
	mask.setAttributeNS(null, "id", "mask");
	//box.setAttributeNS(null, "d", "M 0 0 H 1 V 1 H 0 Z");
	box.setAttributeNS(null, "d", outlinePath);
	anti.setAttributeNS(null, "d", antiPath);
	box.setAttributeNS(null, "fill", "white");
	anti.setAttributeNS(null, "fill", "black");
	var fill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	fill.setAttributeNS(null, "x", 0);
	fill.setAttributeNS(null, "y", 0);
	fill.setAttributeNS(null, "width", board.width);
	fill.setAttributeNS(null, "height", board.height);
	fill.setAttributeNS(null, "fill", "white");
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.setAttributeNS(null, "mask", "url(#mask)");
	group.appendChild(fill);

	mask.appendChild(box);
	mask.appendChild(anti);
	cursorSVG.appendChild(mask);
	cursorSVG.appendChild(group);
}

function pathString(x, y, x2, y2, offset) {
	return `M ${x - offset} ${y - offset} H ${x2 + offset} V ${
		y2 + 1 + offset
	} H ${x - offset} Z `;
}
var svgOffset = 0;

function drawEraserPreview(x, y) {
	cursorSVG.innerHTML = "";
	eraserBufferCanvas.width = project.width;
	eraserBufferCanvas.height = project.height;
	eraserBufferCtx.clearRect(0, 0, project.width, project.height);
	eraserBufferCtx.fillStyle = "white";
	let brushSize = parseInt(settings.tools.brushSize.value);
	let r = brushSize - 1;
	if (Tools.fillBucket) r = 0;
	let c;
	if (brushSize % 2 == 0) {
		c = filledEllipse(
			x - r / 2 - 0.5,
			y - r / 2 - 0.5,
			x + r / 2 - 0.5,
			y + r / 2 - 0.5
		);
	} else if (brushSize % 2 != 0) {
		c = filledEllipse(x - r / 2, y - r / 2, x + r / 2, y + r / 2);
	}
	var b;
	//for (b of c) { eBufDraw(b) }
	var outlinePath = "";
	var antiPath = "";
	for (b of c) {
		outlinePath += pathString(b.x1, b.y1, b.x2, b.y2, svgOffset);
		antiPath += pathString(b.x1, b.y1, b.x2, b.y2, 0);
	}

	drawOnSVGCanvas(outlinePath, antiPath);
}

function drawSprayPreview(x, y) {
	eraserBufferCanvas.width = project.width;
	eraserBufferCanvas.height = project.height;
	eraserBufferCtx.clearRect(0, 0, project.width, project.height);
	eraserBufferCtx.fillStyle = "white";
	let brushSize = parseInt(settings.tools.spraySize.value);
	let r = brushSize - 1;
	if (Tools.fillBucket) r = 0;
	let c;
	if (brushSize % 2 == 0) {
		c = filledEllipse(
			x - r / 2 - 0.5,
			y - r / 2 - 0.5,
			x + r / 2 - 0.5,
			y + r / 2 - 0.5
		);
	} else if (brushSize % 2 != 0) {
		c = filledEllipse(x - r / 2, y - r / 2, x + r / 2, y + r / 2);
	}
	var b;
	var outlinePath = "";
	var antiPath = "";
	for (b of c) {
		outlinePath += pathString(b.x1, b.y1, b.x2, b.y2, svgOffset);
		antiPath += pathString(b.x1, b.y1, b.x2, b.y2, 0);
	}
	drawOnSVGCanvas(outlinePath, antiPath);
}

function eBufDraw(coord) {
	eraserBufferCtx.globalCompositeOperation = "source-over";
	if (coord.constructor.name == "Point") {
		var x = coord.x;
		var y = coord.y;
		eraserBufferCtx.fillRect(x, y, 1, 1);
	} else if (coord.constructor.name == "Rect") {
		var x1 = coord.x1;
		var y1 = coord.y1;
		var x2 = coord.x2;
		var y2 = coord.y2;
		var ax1, ax2, ay1, ay2;
		if (x1 >= x2) {
			ax1 = x2;
			ax2 = x1;
		} else if (x1 < x2) {
			ax1 = x1;
			ax2 = x2;
		}
		if (y1 >= y2) {
			ay1 = y2;
			ay2 = y1;
		} else if (y1 < y2) {
			ay1 = y1;
			ay2 = y2;
		}
		if (ay2 - ay1 == 0) ay2 = ay1 + 1;
		eraserBufferCtx.fillRect(ax1, ay1, ax2 - ax1, ay2 - ay1);
	}
}

var cursor = document.getElementById("cursor");

function canvasResized() {
	svgOffset = 1 / board.canvScale;
	if (Tools.eraser) {
		drawEraserPreview(board.currentX, board.currentY);
	}
	if (Tools.sprayPaint) {
		drawSprayPreview(board.currentX, board.currentY);
	}
}
function clearSVGBrushPreviews() {
	cursorSVG.innerHTML = "";
}
