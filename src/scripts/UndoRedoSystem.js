var undoStack = [];
var undoIndex = 0;
var undoMax = 10;

function addToUndoStack(undoCallback, redoCallback) {
    if(undoIndex < undoStack.length-1) {
        undoStack.splice(undoIndex+1)
    }
    undoIndex = undoStack.length
    undoStack.push(Math.random('a').toString().substring(0, 5))
    if(undoStack.length > undoMax) {undoStack.shift(); undoIndex--;}
    console.log(`Undo Stack: ${undoStack}\nUndo Index: ${undoIndex} \nUndo Value: ${undoStack[undoIndex]}`)
}

function undo() {
    if(undoIndex <= 0) return;
    undoIndex -= 1;
    console.log(`undid! \nUndo Stack: ${undoStack}\nUndo Index: ${undoIndex} \nUndo Value: ${undoStack[undoIndex]}`)
}

function redo() {
    if(undoIndex == undoStack.length-1) return;
    undoIndex += 1;
    console.log(`redid! \nUndo Stack: ${undoStack}\nUndo Index: ${undoIndex} \nUndo Value: ${undoStack[undoIndex]}`)
}