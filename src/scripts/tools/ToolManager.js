import { Brush } from "./Brush.js"

export class ToolManager {
    constructor() {
        this.tools = []
    }
    registerTools() {
        this.tools.push(new Brush())
    }
    getActiveTool() {
        return this.tools[0]
    }
    setActiveTool(tool) {

    }
}