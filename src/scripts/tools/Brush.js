import { Tool } from "./ToolBase.js";
import { Cel } from "../ImageData.js";
import { Color, COLORS } from "../Util.js";
import { Point } from "../Shapes.js";

export class Brush extends Tool {
	constructor() {
		super();
		this.name = "Brush";
		this.pE = null;
	}
	inputActive(e) {
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let pCoords = CoreRenderer.getCoordinatesFromInputEvent(this.pE);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let dummyCel = new Cel(5, 5, COLORS.black);
		layerCel.drawCel(dummyCel, coords.x, coords.y, true);
		layerCel.drawLine(
			dummyCel,
			new Point(coords.x, coords.y),
			new Point(pCoords.x, pCoords.y),
			true
		);
        this.pE = e;
	}
	inputStart(e) {
		this.pE = e;
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let dummyCel = new Cel(4, 4, COLORS.green);
		layerCel.drawCel(dummyCel, coords.x, coords.y, true);
	}
	inputEnd(e) {

    }
    inputPreview(e) {
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let dummyCel = new Cel(4, 4, COLORS.green);
		layerCel.tempDrawCel(dummyCel, coords.x, coords.y, true);
    }
}
