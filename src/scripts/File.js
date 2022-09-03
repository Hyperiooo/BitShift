function packFile() {
	project = {
		name: projName,
		palettes: filePalettes,
		currColor: board.color,
		width: board.width,
		height: board.height,
		layers: layers.reverse(),
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
	if (typeof board !== "undefined") {
		board.destroy();
	}
	var width = +file.width;
	var height = +file.height;
	window.board = new Canvas(file.width, file.height);
	window.colors = defaultPalettes;
	preparePalette();
	board.setColor(file.currColor);
	project = {
		name: file.name,
		palettes: filePalettes,
		currColor: file.currColor,
		width: width,
		height: height,
		layers: file.layers,
	};

	projName = project.name;

	document.getElementById("topbar-project-name").value = projName;
	file.layers.forEach((e) => {
		console.log(e);
		newLayer(e.name, e.data, e.settings);
	});
	initializeGestures();
}

function openFile() {
	document.getElementById("fileOpenDialog").click();
}

if (document.getElementById("fileOpenDialog"))
	document.getElementById("fileOpenDialog").onchange = parseFile;
