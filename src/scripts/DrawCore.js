var settings = {
	background: {
		width: 4, //size in px
		height: 4, //size in px
		colorOne: "#ffffff",
		colorTwo: "#e8e8e8",
	},
	ui: {
		canvasScale: 2,
		angle: 0,
		transformX: 0,
		transformY: 0,
	},
	cursors: {
		pen: "crosshair",
		eyedropper: "eyedropper",
		fillBucket: "fillbucket",
	},
	tools: {
		assignments: {
			pen: ["penBrushSize"],
			eraser: ["eraserBrushSize"],
			sprayPaint: ["sprayBrushSize", "spraySpeed", "spraySize"],
			fillBucket: ["contiguous"],
			rectangleMarquee: ["selectionMode"],
			ellipseMarquee: ["selectionMode"],
		},
		penBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: (e) => {
				settings.tools.penBrushSize.value = e.value;
			},
		},
		eraserBrushSize: {
			title: "Eraser Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: (e) => {
				settings.tools.eraserBrushSize.value = e.value;
			},
		},
		sprayBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: (e) => {
				settings.tools.sprayBrushSize.value = e.value;
			},
		},
		brushSquare: {
			title: "Square Brush",
			value: false,
			type: "bool",
			callback: (e) => {
				settings.tools.brushSquare = e.checked;
			},
		},
		brushSmoothing: {
			title: "Brush Smoothness",
			value: 0,
			type: "int",
			draggable: true,
			min: 0,
			max: 100,
			unit: "px",
			callback: (e) => {
				settings.tools.brushSmoothing.value = e.value;
			},
		},
		brushPixelPerfect: {
			title: "Pixel Perfect",
			value: false,
			type: "bool",
			callback: (e) => {
				settings.tools.brushPixelPerfect.value = e.value;
			},
		},
		spraySpeed: {
			title: "Spray Speed",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			callback: (e) => {
				settings.tools.spraySpeed.value = e.value;
			},
		},
		spraySize: {
			title: "Spray Size",
			value: 10,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: (e) => {
				settings.tools.spraySize.value = e.value;
				createSprayPoints();
			},
		},
		contiguous: {
			title: "Contiguous",
			value: true,
			type: "bool",
			callback: (e) => {
				settings.tools.contiguous.value = e.checked;
			},
		},
		selectionMode: {
			title: "Selection Mode",
			value: "replace",
			type: "iconArray",
			initialCallback: (e) => {
				setSelectionMode("replace");
			},
			values: [
				{
					name: "replace",
					icon: "hi-replace-selection",
					callback: (e) => {
						setSelectionMode("replace");
					},
				},
				{
					name: "add",
					icon: "hi-add-selection",
					callback: (e) => {
						setSelectionMode("add");
					},
				},
				{
					name: "subtract",
					icon: "hi-subtract-selection",
					callback: (e) => {
						setSelectionMode("subtract");
					},
				},
			],
		},
	},
};

var project = {
	palettes: null,
	currColor: null,
	width: null,
	height: null,
	layers: layers,
};

var lc = [];
var preview = true;
var isMobile = window.matchMedia("(pointer: coarse)").matches;

if (isMobile) {
	var docElm = document.documentElement;
	if (docElm.requestFullscreen) {
		docElm.requestFullscreen();
	} else if (docElm.msRequestFullscreen) {
		docElm.msRequestFullscreen();
	} else if (docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	} else if (docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}
}
//initialiation
window.onload = async function () {
	debug = new Alrt({
		position: "bottom-left",
		duration: 2000,
		theme: "alrt-default-light",
	});
	notify = new Alrt({
		position: "top-center",
		duration: 2000, //default duration
		theme: "bitshift-confirmation",
		behavior: "overwrite",
	});
	window.colors = defaultPalettes;

	hThumb = document.getElementById("color-hue-thumb");
	hueRange = document.getElementById("color-hue");
	vThumb = document.getElementById("color-value-thumb");
	valueRange = document.getElementById("color-value");
	hueRect = hueRange.getBoundingClientRect();
	valueRect = valueRange.getBoundingClientRect();

	refreshAllNumberDraggables();

	setTheme(localStorage.getItem("theme") || "ui-theme-dark");
	setAccent(localStorage.getItem("accent") || "ui-accent-blue");
	window.numberPad = new NumberInputKeypad();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (window.location.hash && window.location.pathname.includes("draw")) {
		selectProject(window.location.hash.replace("#", ""));
	} else if (window.location.pathname.includes("draw")) {
		window.location.href = "/";
	}
	setUpSelectionSVG();
	updateCursor();
	createToolUI();
	setTool("pen");
	setPickerMode("value");

	document.querySelectorAll("[data-color-slider]").forEach((e) => {
		new ColorSlider(e, e.getAttribute("data-color-slider"));
	});
	setPickerMode("picker");
	refreshAllTooltips()
};

window.onbeforeunload = function () {
	saveData();
};

window.onpagehide = function () {
	saveData();
};
function compileData() {
	confirmTransform();
	project = {
		name: projName,
		palettes: filePalettes,
		currColor: canvasInterface.color,
		width: canvasInterface.width,
		height: canvasInterface.height,
		layers: [...layers].reverse(),
		previewImage: createPreviewImage(),
	};
	return project;
}

function createPreviewImage() {
	var dummyCanvas = document.createElement("canvas");
	dummyCanvas.width = project.width;
	dummyCanvas.height = project.height;
	var dCtx = dummyCanvas.getContext("2d");
	dCtx.clearRect(0, 0, project.width, project.height);
	dCtx.imageSmoothingEnabled = false;
	var reversed = [...layers].reverse();
	reversed.forEach((e) => {
		dCtx.globalCompositeOperation = "source-over";
		if (e.settings.visible) dCtx.drawImage(e.canvasElement, 0, 0);
	});
	return dummyCanvas.toDataURL("image/png");
}

function saveData() {
	localStorage.setItem("pc-canvas-data", JSON.stringify(compileData()));
}

function setPreset(w, h, el) {
	document.querySelectorAll(".file-preset-active").forEach((e) => {
		e.classList.remove("file-preset-active");
	});
	el.classList.add("file-preset-active");
	document.getElementById("width").value = w;
	document.getElementById("height").value = h;
}

var projName = "";

function renameProject(el) {
	if (el.value == "" || el.value == null) {
		return;
	} else {
		projName = el.value;
		project.name = el.value;
	}
}
