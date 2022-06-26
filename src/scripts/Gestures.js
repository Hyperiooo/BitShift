var gestureAssignments = {
    "ALT+SHIFT+C": e => { board.clear() },
    "ALT+C": e => { toggleColorPicker() },
    "P": e => { setmode("pen") },
    "B": e => { setmode("pen") },
    "E": e => { setmode("eraser") },
    "G": e => { setmode("fillBucket") },
    "S": e => { setmode("sprayPaint") },
    "I": e => { setmode("eyedropper") },
    "L": e => { setmode("line") },
    "CONTROL+Z": e => { undo() },
    "CONTROL+SHIFT+Z": e => { redo() },
}


function keyboardInput(e) {
    var activeElement = document.activeElement;
    var inputs = ['input', 'select', 'button', 'textarea'];

    if (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) == -1) {
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
}

var gestureTimeout;
var gestureStarted = false;

var gestureTouches = ""


function initializeGesture(e) {
    if (!gestureStarted) gestureStarted = true
    if (gestureStarted) {
        clearTimeout(gestureTimeout)
    }

    gestureTouches = gestureTouches + "S"
    gestureTimeout = setTimeout(() => {
        //debug.log(gestureTouches)
        gestureTouches = ""
    }, 100)
}

function endTouch(e) {

}

function cancelGesture(e) {

}


class TapGesture {
    /**
     * 
     * @param {Object} options
     * @param {DOMElement} element 
     * @param {Function} callback 
     */
    constructor(options, element, callback) {
        this.options = options
        this.callback = callback
        this.totalTouches = 0
        this.currentTouches = 0
        this.touchStarts = []
        console.log(element)

        var _self = this
        element.addEventListener('touchstart', function(e) {
            _self.touchStart(e, _self);
        });
        element.addEventListener('touchend', function(e) {
            _self.touchEnd(e, _self);
        });
        //element.ontouchstart = this.touchStart
        //element.ontouchend = this.touchEnd
    }

    touchStart(e, _self) {
        for (let i = 0; i < e.targetTouches.length; i++) {
            _self.totalTouches += 1
        }
        _self.touchStarts.push(Date.now())
        _self.currentTouches = e.touches.length
        console.log('Touch Started', e, e.targetTouches.length)
    }
    touchEnd(e, _self) {
        _self.currentTouches = e.touches.length
        console.log("Touch Ended", e)
        console.log(_self.touchStarts)
        console.log(_self.currentTouches)
        if (_self.currentTouches == 0) _self.evaluateGesture(_self)
    }

    evaluateGesture(_self) {
        console.log("evaluating gesture")
        console.log(_self.totalTouches)
        var pass = true;
        if (_self.totalTouches != _self.options.inputs) {
            //debug.log("gesture failed - incnum")
            pass = false
        }


        if (pass) {
            //debug.log("gesture passed")
            _self.callback(_self)
        }
        _self.resetGesture(_self)
    }
    resetGesture(_self) {

        _self.totalTouches = 0
        _self.currentTouches = 0
        _self.touchStarts = []
    }
}

function initializeGestures() {
    console.log("board")
    board.canvasParent.ontouchstart = initializeGesture
    document.onmousedown = initializeGesture
    document.ontouchend = endTouch
    var doubleTapGesture = new TapGesture({ inputs: 2, minDelay: 0, maxDelay: 300, tolerance: 10 }, board.canvasParent, undo)
    var doubleTapGesture = new TapGesture({ inputs: 3, minDelay: 0, maxDelay: 300, tolerance: 10 }, board.canvasParent, redo)
}

function doubleTapCallback(e) {
    undo()
}