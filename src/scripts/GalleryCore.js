var settings = {
	background: {
		width: 4, //size in px
		height: 4, //size in px
		colorOne: "#f0f0f0",
		colorTwo: "#d4d4d4",
		colorOne: "#ffffff",
		colorTwo: "#f0f0f0",
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
		},
		penBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: "settings.tools.penBrushSize.value = this.value",
		},
		eraserBrushSize: {
			title: "Brush Size",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: "settings.tools.eraserBrushSize.value = this.value",
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
			callback: "settings.tools.brushSquare.value = this.checked",
		},
		brushSmoothing: {
			title: "Brush Smoothness",
			value: 0,
			type: "int",
			draggable: true,
			min: 0,
			max: 100,
			unit: "px",
			callback: "settings.tools.brushSmoothing.value = this.value",
		},
		brushPixelPerfect: {
			title: "Pixel Perfect",
			value: false,
			type: "bool",
			callback: "settings.tools.brushPixelPerfect.value = this.value",
		},
		shapeFilled: {
			value: false,
			type: "bool",
		},
		spraySpeed: {
			title: "Spray Speed",
			value: 1,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback: "settings.tools.spraySpeed.value = this.value",
		},
		spraySize: {
			title: "Spray Size",
			value: 10,
			type: "int",
			draggable: true,
			min: 1,
			max: 100,
			unit: "px",
			callback:
				"settings.tools.spraySize.value = this.value; createSprayPoints();",
		},
		contiguous: {
			title: "Contiguous",
			value: true,
			type: "bool",
			callback: "settings.tools.contiguous.value = this.checked",
		},
	},
};

var project = {
	palettes: null,
	currColor: null,
	width: null,
	height: null,
	layers: null,
};

var lc = [];
var preview = true;
var isMobile = false;
if (
	/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
		navigator.userAgent
	) ||
	/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
		navigator.userAgent.substr(0, 4)
	)
) {
	isMobile = true;
}

window.onload = function () {
	debug = new Alrt({
		position: "bottom-left",
		duration: 2000,
		theme: "alrt-default-light",
	});
	notify = new Alrt({
		position: "top-center",
		duration: 5000, //default duration
		theme: "bitshift-confirmation",
		behavior: "overwrite",
	});
	window.colors = defaultPalettes;

	var numDraggable = document.querySelectorAll("[data-input-num-draggable]");
	numDraggable.forEach((e) => {
		draggableNumInputs.push(new numberDraggable(e));
	});

	let canvasData = localStorage.getItem("pc-canvas-data");

	setTheme(localStorage.getItem("theme") || "ui-theme-dark");

	if (canvasData) {
		data = JSON.parse(canvasData);
		project = data;
		projName = data.name;
	} else {
		newProject();
	}
};

function newProject() {
	closeMenu();
	localStorage.removeItem("pc-canvas-data");
	window.dim = new Popup("#popup");
}

function saveData() {
	/*
    project = {
        'name': projName,
        'palettes': filePalettes,
        'currColor': board.color,
        'width': board.width,
        'height': board.height,
        'layers': layers.reverse()
    }
    localStorage.setItem('pc-canvas-data', JSON.stringify(project));*/
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
          <i class="hi-file-line"></i>
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

var ev = new Event("build");

document.dispatchEvent(ev);

document.addEventListener("asdfasdf", (e) => {
	console.alert("asdfasdfasdfa");
});
function f() {
	document.getElementById("galleryContent").classList.toggle("visible");
	document.getElementById("editorContent").classList.toggle("visible");
}
