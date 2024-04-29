import { Tool } from "./ToolBase.js";

export class Brush extends Tool {
    constructor(){ 
        super();
        this.name = "Brush";

    }
    inputActive(e, pE) {
    }
    inputStart(e) {
        console.log(e)
        Debug.log(e.mouseX)
    }
    inputEnd(e) {
    }

}