var undoStack = [];
var undoIndex = 0;
var undoMax = 500;

function addToUndoStack(undoCallback, redoCallback) {
    if(undoIndex < undoStack.length-1) {
        undoStack.splice(undoIndex+1)
    }
    undoIndex = undoStack.length
    undoStack.push({"undo":undoCallback, "redo":redoCallback})
    if(undoStack.length > undoMax) {undoStack.shift(); undoIndex--;}
    
}

function undo() {
    if(undoIndex <= 0) return;
    undoIndex -= 1;
    undoStack[undoIndex+1].undo()
}

function redo() {
    if(undoIndex == undoStack.length-1) return;
    undoIndex += 1;
    undoStack[undoIndex].redo()
}