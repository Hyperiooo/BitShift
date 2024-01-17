import * as twgl from "https://twgljs.org/dist/4.x/twgl-full.module.js";
import {Renderer} from "./Renderer.js";
window.onload = function () {
    window.CoreRenderer = new Renderer();
    window.CoreRenderer.startRendering();
};