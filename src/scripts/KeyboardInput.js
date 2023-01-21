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
	I: (e) => {
		setTool("eyedropper");
	},
	L: (e) => {
		setTool("line");
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
	"CONTROL+C": (e) => {
		copySelection();
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
		if (keyboardAssignments[inputString]) keyboardAssignments[inputString]();
	}
}
