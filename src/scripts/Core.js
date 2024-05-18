import * as twgl from "https://twgljs.org/dist/4.x/twgl-full.module.js";
import { Renderer } from "./Renderer.js";
import { CanvasManager } from "./CanvasManager.js";
import { Debug } from "./Debug.js";
import { InputManager } from "./InputManager.js";
import { ToolManager } from "./tools/ToolManager.js";
import { LayerManager } from "./LayerManager.js";
window.onload = function () {
	window.projectSize = { w: 128, h: 128 };
	window.Debug = new Debug();
	window.Debug.enableDebug()
	window.Canvas = document.getElementById("rendering-canvas");
	window.CoreRenderer = new Renderer(window.Canvas, projectSize.w, projectSize.h);
	//window.CoreRenderer.startRendering();
	window.CanvasManager = new CanvasManager(projectSize.w, projectSize.h);
	window.CanvasManager.bindRenderer(window.CoreRenderer);
	window.InputManager = new InputManager(window.Canvas);
	window.ToolManager = new ToolManager();
	window.ToolManager.registerTools();
	window.LayerManager = new LayerManager();
	window.LayerManager.createLayer();
};
