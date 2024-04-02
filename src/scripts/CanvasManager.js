import { Color } from "./Util.js";

export class CanvasManager {
    constructor(width, height) {
        this.test = new Color([1,0,0,0]);
        console.log(this.test);
        this.renderer = null
    }

    bindRenderer(Renderer) {
        this.renderer = Renderer;
        this.renderer.startRendering()
    }
}