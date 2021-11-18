document.onkeydown = keyboardInput

var keyboardAssignments = {
    "ALT+SHIFT+C": e => { board.clear() },
    "ALT+C": e => { toggleColorPicker() },
    "P": e => { setmode("pen") },
    "E": e => { setmode("eraser") },
    "G": e => { setmode("fillBucket") },
    "S": e => { setmode("sprayPaint") },
    "I": e => { setmode("eyedropper") },
    "L": e => { setmode("line") },
}

function keyboardInput(e) {
    e.preventDefault()
    e.stopPropagation()
    var input = []
    var inputString = ""
    if (e.ctrlKey) input.push("CONTROL")
    if (e.altKey) input.push("ALT")
    if (e.shiftKey) input.push("SHIFT")
    if (e.key != "Control" && e.key != "Alt" && e.key != "Shift") input.push(e.key.toUpperCase())
    inputString = input.join("+")
    if (keyboardAssignments[inputString]) keyboardAssignments[inputString]()
}