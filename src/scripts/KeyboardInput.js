//document.onkeydown = keyboardInput;

window.onkeydown = keyboardInput;

var keyboardAssignments = {
	"ALT+SHIFT+C": (e) => {
		canvasInterface.clear();
	},
	"ALT+C": (e) => {
		toggleColorPicker();
	},
	P: (e) => {
		setTool("pen");
	},
	B: (e) => {
		setTool("pen");
	},
	E: (e) => {
		setTool("eraser");
	},
	G: (e) => {
		setTool("fillBucket");
	},
	S: (e) => {
		setTool("sprayPaint");
	},
	M: (e) => {
		setTool("rectangle");
	},
	I: (e) => {
		setTool("eyedropper");
	},
	L: (e) => {
		setTool("line");
	},
	T: (e) => {
		setTool("transform");
		prepareTransform();
		showBoundingBox();
	},
	ALT: (e) => {
		if (window.eyedropperEnabled) return;
		previousTool = getTool();
		compileForEyedropper();
		initEyedropper(
			canvasInterface.rawGlobalMouseX,
			canvasInterface.rawGlobalMouseY
		);
		setTool("eyedropper", document.getElementById("tool-btn-eyedropper"));
		window.eyedropperEnabled = true;
		document.addEventListener(
			"keyup",
			function (e) {
				if (e.key == "Alt" && window.eyedropperEnabled) {
					setTool(previousTool);
					canvasInterface.eyedropperPreviewElement.classList.remove(
						"eyedropper-preview-visible"
					);
					window.eyedropperEnabled = false;
				}
			}.bind(this)
		);
	},
	"CONTROL+Z": (e) => {
		undo();
	},
	"CONTROL+SHIFT+Z": (e) => {
		redo();
	},
	"CONTROL+D": (e) => {
		deselect();
	},
	"CONTROL+A": (e) => {
		selectAll();
	},
	"CONTROL+C": (e) => {
		copySelection();
	},
	"CONTROL+L": (e) => {
		toggleLayerMenu();
	},
	"CONTROL+V": (e) => {
		pasteSelection();
	},
	"CONTROL+X": (e) => {
		cutSelection();
	},
	"CONTROL+SHIFT+D": (e) => {
		duplicateSelection();
	},
	DELETE: (e) => {
		deleteSelection();
	},
	ENTER:(e)=> {
		if(Tools["transform"]) {
			confirmTransform(); setTool(previousTool)
		}
	}
};

function keyboardInput(e) {
	var activeElement = document.activeElement;
	var inputs = ["input", "select", "button", "textarea"];

	if (
		activeElement &&
		inputs.indexOf(activeElement.tagName.toLowerCase()) == -1
	) {
		e.preventDefault();
		e.stopPropagation();
		var input = [];
		var inputString = "";
		if (e.ctrlKey) input.push("CONTROL");
		if (e.altKey) input.push("ALT");
		if (e.shiftKey) input.push("SHIFT");
		if (e.key != "Control" && e.key != "Alt" && e.key != "Shift")
			input.push(e.key.toUpperCase());
		inputString = input.join("+");
		if (keyboardAssignments[inputString]) 
			keyboardAssignments[inputString]();
}
}