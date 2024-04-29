export class Tool {
	constructor() {
		this.name = "ToolBase";
		this.icon = "fas fa-mouse-pointer";
		this.cursor = "default";
		this.shortcut = "";
		this.mouseDown = false;
		this.mouseDownPos = [0, 0];
		this.mousePos = [0, 0];
		this.mouseUpPos = [0, 0];
		this.mouseDownTime = 0;
		this.mouseUpTime = 0;
		this.mouseDownButton = 0;
		this.mouseUpButton = 0;
		this.mouseDownEvent = null;
		this.mouseUpEvent = null;
		this.mouseMoveEvent = null;
		this.mouseWheelEvent = null;
		this.mouseClickEvent = null;
		this.mouseDoubleClickEvent = null;
		this.mouseContextMenuEvent = null;
		this.mouseEnterEvent = null;
		this.mouseLeaveEvent = null;
		this.keyDownEvent = null;
		this.keyUpEvent = null;
	}
    inputActive(e, pE) {

    }
    inputStart(e) {

    }
    inputEnd(e) {
        
    }
}
