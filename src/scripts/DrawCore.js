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
			pen: ["penBrushSize", "brushSquare", "brushPixelPerfect"],
			eraser: ["eraserBrushSize", "brushSquare", "brushPixelPerfect"],
			sprayPaint: ["sprayBrushSize", "brushSquare", "spraySpeed", "spraySize"],
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
			title: "Brush Size",
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
window.onload = function () {
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

	let canvasData = localStorage.getItem("pc-canvas-data");

	setTheme(localStorage.getItem("theme") || "ui-theme-dark");
	setAccent(localStorage.getItem("accent") || "ui-accent-blue");

	if (canvasData) {
		data = JSON.parse(canvasData);
		project = data;
		window.canvasInterface = new Canvas(data.width, data.height);
		window.numberPad = new NumberInputKeypad();

		window.canvasInterface.steps = data.steps;
		window.canvasInterface.redo_arr = data.redo_arr;
		if (data.palettes) window.colors = data.palettes;
		preparePalette();
		console.log(data);
		window.canvasInterface.setColor(data.currColor);
		updatePrevious(data.currColor);
		data.layers.reverse().forEach((e) => {
			console.log(e);
			newLayer(e.name, e.data);
		});
		window.gif = new GIF({
			workers: 2,
			quality: 10,
			width: this.canvUnit * window.canvasInterface.width,
			height: this.canvUnit * window.canvasInterface.height,
		});
		window.gif.on("finished", function (blob) {
			var url = URL.createObjectURL(blob);
			var link = document.createElement("a");
			link.download = "canvas.gif";
			link.href = url;
			link.click();
		});
		projName = data.name;
		document.getElementById("topbar-project-name").value = data.name;
		initializeGestures();
	} else {
		newProject();
	}
	setUpSelectionSVG();
	populatePresets();
	updateCursor();
	createToolUI();
	setTool("pen");
	setPickerMode("value");

	document.querySelectorAll("[data-color-slider]").forEach((e) => {
		new ColorSlider(e, e.getAttribute("data-color-slider"));
	});
	setPickerMode("picker");
};

function newProject() {
	closeMenu();
	localStorage.removeItem("pc-canvas-data");
	window.dim = new Popup("#popup");
}

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
		layers: layers,
	};
	return project;
}
function saveData() {
	localStorage.setItem("pc-canvas-data", JSON.stringify(compileData()));
}

var presets = [
	[16, 16],
	[32, 32],
	[64, 64],
	[128, 128],

	[256, 256],
	[512, 512],
	[1024, 1024],

	[160, 144, "Gameboy"],
	[240, 160, "GBA"],
	[256, 240, "NES"],
	[256, 225, "SNES"],
	[320, 224, "Genesis"],
];

function setPreset(w, h, el) {
	document.querySelectorAll(".popup-preset-active").forEach((e) => {
		e.classList.remove("popup-preset-active");
	});
	el.classList.add("popup-preset-active");
	document.getElementById("width").value = w;
	document.getElementById("height").value = h;
}

function populatePresets() {
	var parent = document.getElementById("popup-presets");

	for (let i = 0; i < presets.length; i++) {
		let preset = presets[i];
		parent.innerHTML += `<button class="popup-preset" onclick="setPreset(${
			preset[0]
		}, ${preset[1]}, this)">
          <i class="hi-file"></i>
          ${
						preset[2]
							? `<h1>${preset[2]}</h1>`
							: `<h1 style="opacity: 0; visibility: hidden">+</h1>`
					}
          <h2>${preset[0]} x ${preset[1]}</h2>
        </button>`;
	}
}
var projName = "";

function renameProject(el) {
	if (el.value == "" || el.value == null) {
		return;
	} else {
		projName = el.value;
	}
}
