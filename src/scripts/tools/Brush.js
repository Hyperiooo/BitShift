import { Tool } from "./ToolBase.js";
import { Cel } from "../ImageData.js";
import { Color, COLORS } from "../Util.js";
import { Point, line } from "../Shapes.js";

export class Brush extends Tool {
	constructor() {
		super();
		this.name = "Brush";
		this.pC = null;
		this.brushCel = new Cel(1, 1, COLORS.black);
		this.layerCel = null;
		this.dummyCel = new Cel(1, 1, COLORS.red);
		this.listenToEvent = false;
	}
	inputActive(e) {
		console.log(this.listenToEvent);
		if (!this.listenToEvent) return;
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		this.layerCel = layer.layerCel;
		let linePoints = line(
			new Point(coords.x, coords.y),
			new Point(this.pC.x, this.pC.y)
		);
		this.pC = coords;
		this.brushEngine(linePoints);
	}
	inputStart(e) {
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		this.layerCel = layer.layerCel;
		if (e.button == 0) {
			this.listenToEvent = true;
			this.brushEngine([coords]);
			if (e.shiftKey) {
				let linePoints = line(
					new Point(coords.x, coords.y),
					new Point(this.pC.x, this.pC.y)
				);
				this.brushEngine(linePoints);
			}
			this.pC = coords;
		}
	}
	inputEnd(e) {
		this.listenToEvent = false;
	}
	inputPreview(e) {
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let dummyCel = new Cel(4, 4, COLORS.green);
		//layerCel.tempDrawCel(dummyCel, coords.x, coords.y, true);
	}
	brushEngine(points) {
		let spacing = 0;
		if (spacing >= 0) spacing += 1;
		if (spacing < 0) spacing = Math.abs(1 / spacing);
		let scattering = 0;
		for (let ix = 0; ix < points.length; ix += spacing) {
			let i = Math.floor(ix);
			let p = points[i];
			let r = scattering * Math.sqrt(Math.random());
			let theta = Math.random() * 2 * Math.PI;
			let dx = Math.round(r * Math.cos(theta));
			let dy = Math.round(r * Math.sin(theta));
			this.layerCel.drawCel(this.brushCel, p.x + dx, p.y + dy, true);
		}
	}
}
