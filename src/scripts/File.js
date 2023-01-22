function packFile() {
	project = {
		name: projName,
		palettes: filePalettes,
		currColor: canvasInterface.color,
		width: canvasInterface.width,
		height: canvasInterface.height,
		layers: [...layers].reverse(),
	};
	var packedData = btoa(JSON.stringify(project));
	return packedData;
}

function saveFile() {
	var packedData = packFile();
	var link = document.createElement("a");
	link.download = project.name.toLowerCase().replace(" ", "_") + ".bspr";
	link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(packedData);
	link.click();
	link.delete;
}

function parseFile() {
	var curFiles = document.getElementById("fileOpenDialog").files;
	if (curFiles.length === 0) {
		console.error("no files selected");
	} else {
		for (let i = 0; i < curFiles.length; i++) {
			const file = curFiles[i];

			let reader = new FileReader();
			reader.addEventListener("load", (event) => {
				var file = JSON.parse(atob(event.target.result));
				loadFile(file);
			});

			reader.readAsText(file);
		}
	}
}

function loadFile(file) {
	clearPalettes();
	clearLayerMenu();
	clearLayers();
	layers = [];
	if (typeof canvasInterface !== "undefined") {
		canvasInterface.destroy();
	}
	project = file;
	window.canvasInterface = new Canvas(project.width, project.height);
	if (project.palettes) {
		window.colors = project.palettes;
	} else {
		window.colors = defaultPalettes;
	}
	preparePalette();
	window.canvasInterface.setColor(project.currColor);
	updatePrevious(project.currColor);
	project.layers.forEach((e) => {
		console.log(e);
		newLayer(e.name, e.data, e.settings);
	});
	projName = project.name;
	initializeGestures();
	document.getElementById("topbar-project-name").value = project.name;
}

function openFile() {
	document.getElementById("fileOpenDialog").click();
}

if (document.getElementById("fileOpenDialog"))
	document.getElementById("fileOpenDialog").onchange = parseFile;
