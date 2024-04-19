import * as twgl from "https://twgljs.org/dist/4.x/twgl-full.module.js";
import { Renderer } from "./Renderer.js";
import { CanvasManager } from "./CanvasManager.js";
import { DebugWindow } from "./Debug.js";
import { InputManager } from "./InputManager.js";
window.onload = function () {
	let projSize = { x: 1028, y: 1028 };
	window.DebugWindow = new DebugWindow();
	window.DebugWindow.enableDebug()
	window.CoreRenderer = new Renderer(projSize.x, projSize.y);
	//window.CoreRenderer.startRendering();
	window.CanvasManager = new CanvasManager(projSize.x, projSize.y);
	window.CanvasManager.bindRenderer(window.CoreRenderer);
	window.InputManager = new InputManager();
};
