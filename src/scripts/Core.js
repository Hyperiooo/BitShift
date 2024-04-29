import * as twgl from "https://twgljs.org/dist/4.x/twgl-full.module.js";
import { Renderer } from "./Renderer.js";
import { CanvasManager } from "./CanvasManager.js";
import { Debug } from "./Debug.js";
import { InputManager } from "./InputManager.js";
import { ToolManager } from "./tools/ToolManager.js";
window.onload = function () {
	let projSize = { x: 1028, y: 1028 };
	window.Debug = new Debug();
	window.Debug.enableDebug()
	window.Canvas = document.getElementById("rendering-canvas");
	window.CoreRenderer = new Renderer(window.Canvas, projSize.x, projSize.y);
	//window.CoreRenderer.startRendering();
	window.CanvasManager = new CanvasManager(projSize.x, projSize.y);
	window.CanvasManager.bindRenderer(window.CoreRenderer);
	window.InputManager = new InputManager(window.Canvas);
	window.ToolManager = new ToolManager();
	window.ToolManager.registerTools();
};
