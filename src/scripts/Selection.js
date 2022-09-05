var selectionGroup = document.getElementById("selectionGroup");

var boundingSVG = document.getElementById("boundingSVG");
var rect = document.querySelector("#boundingRect");
var handlebl = document.querySelector(".boundingRectHandle-bl");
var handlebr = document.querySelector(".boundingRectHandle-br");
var handletl = document.querySelector(".boundingRectHandle-tl");
var handletr = document.querySelector(".boundingRectHandle-tr");
var handlebm = document.querySelector(".boundingRectHandle-bm");
var handleml = document.querySelector(".boundingRectHandle-ml");
var handletm = document.querySelector(".boundingRectHandle-tm");
var handlemr = document.querySelector(".boundingRectHandle-mr");
var handlerot = document.querySelector(".boundingRectHandle-rot");
var linerot = document.querySelector("#boundingRotLine");
var boundingHandleSize = 5;
var boundingLineRotSize = 50;
var boundingRotOffset = 0;

var selectionPath = [];
var outlinePath = [];
var stripeWidth;
var selectionStripeDefs = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"defs"
);
var selectionStripePattern = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"pattern"
);
var selectionStripePath = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"path"
);
var selectionStripeFill = document.createElementNS(
	"http://www.w3.org/2000/svg",
	"rect"
);

var selectionMaskBox, selectionMaskAnti, selectionMask, selectionFill;
var svgOffset = 1;
var handleWidth = boundingHandleSize;

function drawOnSelectionSVG(antiPath) {
	svgOffset = 1 / board.canvScale;
	handleWidth = boundingHandleSize / board.canvScale;

	selectionMaskBox.setAttributeNS(null, "d", antiPath);
	selectionMaskBox.setAttributeNS(null, "stroke", "white");
	selectionMaskBox.setAttributeNS(null, "stroke-width", svgOffset);
	selectionMaskAnti.setAttributeNS(null, "d", antiPath);
	selectionMaskAnti.setAttributeNS(null, "stroke", "black");
	selectionMaskAnti.setAttributeNS(null, "stroke-dasharray", stripeWidth);
	selectionMaskAnti.setAttributeNS(null, "stroke-width", svgOffset);
}

function updateSelectionOutline() {
	selectionMaskBox.setAttributeNS(null, "stroke-width", svgOffset);
	selectionMaskAnti.setAttributeNS(null, "stroke-width", svgOffset);
	boundingSVG.setAttributeNS(null, "stroke-width", svgOffset * 1.5);
	document.querySelectorAll(".boundingRectCircleHandle").forEach((e) => {
		e.setAttributeNS(null, "r", handleWidth);
	});
	selectionMaskAnti.setAttributeNS(null, "stroke-dasharray", stripeWidth);
}
var calledAlready = false;

function debounce(callback) {
	if (calledAlready) return;
	setTimeout(() => {
		calledAlready = false;
	}, 500);
	calledAlready = true;
	callback();
}

function modifySelectionPath(x1, y1, x2, y2, type) {
	var modifierPath = [
		[
			{ X: x1, Y: y1 },
			{ X: x2, Y: y1 },
			{ X: x2, Y: y2 },
			{ X: x1, Y: y2 },
		],
	];
	var cpr = new ClipperLib.Clipper();
	var cliptype;
	if (type == "add") {
		cliptype = ClipperLib.ClipType.ctUnion;
	} else if (type == "subtract") {
		cliptype = ClipperLib.ClipType.ctDifference;
	} else if (type == "replace") {
		cliptype = ClipperLib.ClipType.ctUnion;
	}
	cpr.AddPaths(selectionPath, ClipperLib.PolyType.ptSubject, true);
	cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
	var modifiedPaths = new ClipperLib.Paths();
	cpr.Execute(
		cliptype,
		modifiedPaths,
		ClipperLib.PolyFillType.pftNonZero,
		ClipperLib.PolyFillType.pftNonZero
	);
	selectionPath = modifiedPaths;

	modifierPath = [
		[
			{ X: 0, Y: 0 },
			{ X: board.width, Y: 0 },
			{ X: board.width, Y: board.height },
			{ X: 0, Y: board.height },
		],
	];
	var cpr2 = new ClipperLib.Clipper();
	cpr2.AddPaths(selectionPath, ClipperLib.PolyType.ptSubject, true);
	cpr2.AddPaths(modifierPath, ClipperLib.PolyType.ptClip, true);
	modifiedPaths = new ClipperLib.Paths();
	cpr2.Execute(
		ClipperLib.ClipType.ctIntersection,
		modifiedPaths,
		ClipperLib.PolyFillType.pftNonZero,
		ClipperLib.PolyFillType.pftNonZero
	);
	selectionPath = modifiedPaths;

	drawSelectionPreview();
}

function deselect() {
	selectionPath = [];
	drawSelectionPreview();
}
function invertSelection() {
	//inverts selection. wow
	modifierPath = [
		[
			{ X: 0, Y: 0 },
			{ X: board.width, Y: 0 },
			{ X: board.width, Y: board.height },
			{ X: 0, Y: board.height },
		],
	];
	var cpr = new ClipperLib.Clipper();
	var cliptype = ClipperLib.ClipType.ctDifference;
	cpr.AddPaths(modifierPath, ClipperLib.PolyType.ptSubject, true);
	cpr.AddPaths(selectionPath, ClipperLib.PolyType.ptClip, true);
	var modifiedPaths = new ClipperLib.Paths();
	cpr.Execute(
		cliptype,
		modifiedPaths,
		ClipperLib.PolyFillType.pftNonZero,
		ClipperLib.PolyFillType.pftNonZero
	);
	selectionPath = modifiedPaths;
	drawSelectionPreview();
}

function drawSelectionPreview() {
	console.time("preview");
	outlinePath = [];
	selectionPath.forEach((e) => {
		var outlinedPath = [[], [], [], []];
		e.forEach((x) => {
			outlinedPath[0].push({ X: x.X + svgOffset, Y: x.Y + svgOffset });
			outlinedPath[1].push({ X: x.X - svgOffset, Y: x.Y + svgOffset });
			outlinedPath[2].push({ X: x.X + svgOffset, Y: x.Y - svgOffset });
			outlinedPath[3].push({ X: x.X - svgOffset, Y: x.Y - svgOffset });
		});
		outlinedPath.forEach((e) => {
			outlinePath.push(e);
		});
	});
	notify.log(selectionPath.length);
	drawOnSelectionSVG(paths2string(selectionPath));
	if (isSelected()) {
		//show action button if selected, hide if not
		document
			.querySelector("#actionButtons")
			.classList.remove("actionButtonsHidden");
	} else {
		document
			.querySelector("#actionButtons")
			.classList.add("actionButtonsHidden");
	}
	updateBounding();
}

function canvasResized() {
	stripeWidth = 6 / (board ? board.canvScale : 4);
	svgOffset = 1 / board.canvScale;
	handleWidth = boundingHandleSize / board.canvScale;
	boundingRotOffset = boundingLineRotSize / board.canvScale;
	handlerot.setAttributeNS(null, "cy", minY - boundingRotOffset);
	linerot.setAttributeNS(null, "x1", (minX + maxX) / 2);
	linerot.setAttributeNS(null, "x2", (minX + maxX) / 2);
	linerot.setAttributeNS(null, "y1", minY);
	linerot.setAttributeNS(null, "y2", minY - boundingRotOffset);
	updateSelectionOutline();
}

function paths2string(paths, scale) {
	var svgpath = "",
		i,
		j;
	if (!scale) scale = 1;
	for (i = 0; i < paths.length; i++) {
		for (j = 0; j < paths[i].length; j++) {
			if (!j) svgpath += "M";
			else svgpath += "L";
			svgpath += paths[i][j].X / scale + ", " + paths[i][j].Y / scale;
		}
		svgpath += "Z";
	}
	if (svgpath == "") svgpath = "M0,0";
	return svgpath;
}

function isSelected() {
	return selectionPath.length != 0;
}

function setUpSelectionSVG() {
	selectionMaskBox = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	selectionMaskAnti = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	selectionMaskBox.setAttributeNS(null, "id", "selectionMaskContent");
	selectionMaskAnti.setAttributeNS(null, "id", "selectionMaskSubtract");
	selectionMaskBox.setAttributeNS(null, "fill", "#0000");
	selectionMaskAnti.setAttributeNS(null, "fill", "#0000");
	selectionMask = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"mask"
	);
	selectionMask.setAttributeNS(null, "id", "selectMask");
	selectionFill = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"rect"
	);
	var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	//group.setAttributeNS(null, "mask", "url(#selectMask)")
	//group.appendChild(selectionFill)
	selectionFill.setAttributeNS(null, "x", -stripeWidth);
	selectionFill.setAttributeNS(null, "y", -stripeWidth);
	selectionFill.setAttributeNS(null, "width", board.width + stripeWidth);
	selectionFill.setAttributeNS(null, "height", board.height + stripeWidth);
	selectionFill.setAttributeNS(null, "fill", "url(#stripes)");

	group.appendChild(selectionMaskBox);
	group.appendChild(selectionMaskAnti);
	//selectionGroup.appendChild(selectionMask)
	selectionGroup.appendChild(group);
	requestAnimationFrame(stripeAnimation);
}
var stripeOffset = 0;
var previousElapsed;

function stripeAnimation(elapsed) {
	stripeOffset += 0.5 / (board.canvScale || 1);

	selectionMaskAnti.setAttributeNS(null, "stroke-dashoffset", stripeOffset);
	requestAnimationFrame(stripeAnimation);
}
var minX = 0;
var maxX = 0;
var minY = 0;
var maxY = 0;

function updateBounding() {
	minX = board.width;
	maxX = 0;
	minY = board.height;
	maxY = 0;
	selectionPath.forEach((s) => {
		s.forEach((e) => {
			console.log(e.X, e.Y);
			if (e.X < minX) minX = e.X;
			if (e.X > maxX) maxX = e.X;
			if (e.Y < minY) minY = e.Y;
			if (e.Y > maxY) maxY = e.Y;
		});
	});
	console.log(minX, maxX, minY, maxY);
	rect.setAttributeNS(null, "x", minX);
	rect.setAttributeNS(null, "y", minY);
	rect.setAttributeNS(null, "width", maxX - minX);
	rect.setAttributeNS(null, "height", maxY - minY);
	handlebl.setAttributeNS(null, "cx", minX);
	handlebl.setAttributeNS(null, "cy", minY);
	handlebr.setAttributeNS(null, "cx", maxX);
	handlebr.setAttributeNS(null, "cy", minY);
	handletl.setAttributeNS(null, "cx", minX);
	handletl.setAttributeNS(null, "cy", maxY);
	handletr.setAttributeNS(null, "cx", maxX);
	handletr.setAttributeNS(null, "cy", maxY);
	handlebm.setAttributeNS(null, "cx", (minX + maxX) / 2);
	handlebm.setAttributeNS(null, "cy", minY);
	handleml.setAttributeNS(null, "cx", minX);
	handleml.setAttributeNS(null, "cy", (minY + maxY) / 2);
	handletm.setAttributeNS(null, "cx", (minX + maxX) / 2);
	handletm.setAttributeNS(null, "cy", maxY);
	handlemr.setAttributeNS(null, "cx", maxX);
	handlemr.setAttributeNS(null, "cy", (minY + maxY) / 2);
	handlerot.setAttributeNS(null, "cx", (minX + maxX) / 2);
	handlerot.setAttributeNS(null, "cy", minY - boundingRotOffset);
	linerot.setAttributeNS(null, "x1", (minX + maxX) / 2);
	linerot.setAttributeNS(null, "x2", (minX + maxX) / 2);
	linerot.setAttributeNS(null, "y1", minY);
	linerot.setAttributeNS(null, "y2", minY - boundingRotOffset);
}

function showBoundingBox() {
	boundingSVG.style.opacity = 1;
	//selectionGroup.style.opacity = 0;
}

function hideBoundingBox() {
	//selectionGroup.style.opacity = 1;
	boundingSVG.style.opacity = 0;
}
