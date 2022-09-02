function toggleLayerMenu() {
	document.getElementById("layer-menu").classList.toggle("layer-open");
	document.getElementById("color-menu").classList.remove("color-open");
	document
		.getElementById("layer-toggle-button")
		.classList.toggle("tool-active");
}

var layers = [];

var activeLayer = null;

function arraymove(arr, fromIndex, toIndex) {
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}

function populateLayers() {
	layers.forEach((e) => {
		createLayer(e.name);
	});
}

function createLayer(n, data, settings) {
	//create layer with set data; e.g. load a layer from a file
	console.log(project.width, project.height);
	var id = randomString(10);
	console.log(layers.length);
	var wrap = document.createElement("div");
	wrap.classList.add("layer-wrap");
	wrap.id = "l-" + id;
	wrap.onpointerup = function (e) {
		e.preventDefault();
		console.log("pointer");
		if (e.target == wrap) setLayer(id);
	};
	var previewWrapper = document.createElement("div");
	previewWrapper.classList.add("layer-preview");
	var preview = document.createElement("canvas");
	preview.width = project.width;
	preview.height = project.height;
	var name = document.createElement("div");
	name.classList.add("layer-name");
	name.innerText = n;
	wrap.appendChild(previewWrapper);
	previewWrapper.appendChild(preview);
	wrap.appendChild(name);
	document.getElementById("layer-main").prepend(wrap);

	var visButton = document.createElement("button");
	visButton.classList.add("layer-visibility");
	visButton.setAttribute("onclick", `toggleLayerVisibility('${id}', this)`);

	var visIcon = document.createElement("i");
	visIcon.classList.add("hi-eye-line");

	visButton.appendChild(visIcon);

	var lockButton = document.createElement("button");
	lockButton.classList.add("layer-locked");
	lockButton.setAttribute("onclick", `toggleLayerLock('${id}', this)`);

	var lockIcon = document.createElement("i");
	lockIcon.classList.add("hi-lock-open-line");

	var alphaWrap = document.createElement("div");
	alphaWrap.classList.add("layer-alpha-icon");

	var alphaIcon = document.createElement("i");
	alphaIcon.classList.add("hi-alpha-line");
	alphaWrap.appendChild(alphaIcon);

	lockButton.appendChild(lockIcon);

	wrap.appendChild(visButton);

	wrap.appendChild(lockButton);

	wrap.appendChild(alphaWrap);

	var drawCanvas = document.createElement("canvas");
	drawCanvas.setAttribute("customcursor", "");
	drawCanvas.width = project.width;
	drawCanvas.height = project.height;
	drawCanvas.classList.add("drawingCanvas");
	drawCanvas.id = "c-" + id;
	drawCanvas.style.setProperty("--zindex", layers.length);
	var context = drawCanvas.getContext("2d");
	document.getElementById("layers-wrap").prepend(drawCanvas);

	layers.unshift({
		name: n,
		index: layers.length,
		id: id,
		previewCanvas: preview,
		previewCTX: preview.getContext("2d"),
		layerElement: wrap,
		canvasElement: drawCanvas,
		ctx: context,
		settings: {
			visible: true,
			locked: false,
		},
		data: data,
	});
	let img = new Image();
	img.setAttribute("src", data);
	img.addEventListener("load", function () {
		context.drawImage(img, 0, 0);
		preview.getContext("2d").drawImage(img, 0, 0);
	});
	setLayer(id, false);
}

function newLayer(width, height) {
	//create a blank layer
	console.log(project.width, project.height);
	var id = randomString(10);
	var n = "Layer " + (layers.length + 1);
	console.log(layers.length);
	var wrap = document.createElement("div");
	wrap.classList.add("layer-wrap");
	wrap.id = "l-" + id;
	wrap.onpointerup = function (e) {
		e.preventDefault();
		console.log("pointer");
		if (e.target == wrap) setLayer(id);
	};
	var preview = document.createElement("canvas");
	preview.classList.add("layer-preview");
	preview.width = project.width;
	preview.height = project.height;
	var name = document.createElement("div");
	name.classList.add("layer-name");
	name.innerText = n;
	wrap.appendChild(preview);
	wrap.appendChild(name);
	document.getElementById("layer-main").prepend(wrap);

	var visButton = document.createElement("button");
	visButton.classList.add("layer-visibility");
	visButton.setAttribute("onclick", `toggleLayerVisibility('${id}', this)`);

	var visIcon = document.createElement("i");
	visIcon.classList.add("hi-eye-line");

	visButton.appendChild(visIcon);

	var lockButton = document.createElement("button");
	lockButton.classList.add("layer-locked");
	lockButton.setAttribute("onclick", `toggleLayerLock('${id}', this)`);

	var lockIcon = document.createElement("i");
	lockIcon.classList.add("hi-lock-open-line");

	lockButton.appendChild(lockIcon);

	wrap.appendChild(visButton);

	wrap.appendChild(lockButton);

	var drawCanvas = document.createElement("canvas");
	drawCanvas.setAttribute("customcursor", "");
	drawCanvas.width = project.width;
	drawCanvas.height = project.height;
	drawCanvas.classList.add("drawingCanvas");
	drawCanvas.id = "c-" + id;
	drawCanvas.style.setProperty("--zindex", layers.length);
	var context = drawCanvas.getContext("2d");
	document.getElementById("layers-wrap").prepend(drawCanvas);

	layers.unshift({
		name: n,
		index: layers.length,
		id: id,
		previewCanvas: preview,
		previewCTX: preview.getContext("2d"),
		layerElement: wrap,
		canvasElement: drawCanvas,
		ctx: context,
		settings: {
			visible: true,
			locked: false,
		},
		data: null,
	});
	setLayer(id, true);
}

function clearLayerMenu() {
	console.trace("a");
	document.getElementById("layer-main").innerText = "";
}

function clearLayers() {
	document
		.getElementById("layers-wrap")
		.querySelectorAll("canvas")
		.forEach((e) => {
			e.parentElement.removeChild(e);
		});
}

function setLayer(id) {
	//notify.log("asdf");
	layer = layers.find((obj) => {
		return obj.id == id;
	});
	document.querySelectorAll(".layer-active").forEach((e) => {
		e.classList.remove("layer-active");
	});
	if (layer) {
		layer.layerElement.classList.add("layer-active");
		activeLayer = layer;
		board.ctx = layer.ctx;
		board.setColor(board.color);
	}
}

function updateCanvasPreview() {
	layer = layers.find((obj) => {
		return obj.id == activeLayer.id;
	});
	if (layer) {
		layer.data = layer.canvasElement.toDataURL();
		layer.previewCTX.clearRect(
			0,
			0,
			layer.canvasElement.width,
			layer.canvasElement.height
		);
		layer.previewCTX.drawImage(layer.canvasElement, 0, 0);
	}
}

function reorderLayers() {
	layers.forEach((e) => {
		i = e.index;
		setTimeout(() => {
			e.canvasElement.style.setProperty("--zindex", e.index);
		}, 10);
	});
}

function toggleLayerVisibility(id, el) {
	layer = layers.find((obj) => {
		return obj.id == id;
	});
	if (layer) {
		if (layer.settings.visible == true) {
			el.querySelector("i").classList.replace(
				"hi-eye-line",
				"hi-eye-crossed-line"
			);
			layer.settings.visible = false;
			layer.canvasElement.style.visibility = "hidden";
		} else if (layer.settings.visible == false) {
			el.querySelector("i").classList.replace(
				"hi-eye-crossed-line",
				"hi-eye-line"
			);
			layer.settings.visible = true;
			layer.canvasElement.style.visibility = "unset";
		}
	}
}

function toggleLayerLock(id, el) {
	layer = layers.find((obj) => {
		return obj.id == id;
	});
	if (layer) {
		if (layer.settings.locked == true) {
			el.querySelector("i").classList.replace(
				"hi-lock-line",
				"hi-lock-open-line"
			);
			layer.settings.locked = false;
		} else if (layer.settings.locked == false) {
			el.querySelector("i").classList.replace(
				"hi-lock-open-line",
				"hi-lock-line"
			);
			layer.settings.locked = true;
		}
	}
}
function toggleAlphaLock(id, el) {
	layer = layers.find((obj) => {
		return obj.id == id;
	});
	if (layer) {
		if (layer.settings.locked == true) {
			el.querySelector("i").classList.replace(
				"hi-lock-line",
				"hi-lock-open-line"
			);
			layer.settings.locked = false;
		} else if (layer.settings.locked == false) {
			el.querySelector("i").classList.replace(
				"hi-lock-open-line",
				"hi-lock-line"
			);
			layer.settings.locked = true;
		}
	}
}

function openLayerSettings(layer) {
	console.log(layer.settings);
}
