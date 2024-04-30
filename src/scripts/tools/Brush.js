import { Tool } from "./ToolBase.js";
import { Cel } from "../ImageData.js";
import { Color, COLORS } from "../Util.js";
import { Point, line } from "../Shapes.js";

export class Brush extends Tool {
	constructor() {
		super();
		this.name = "Brush";
		this.pE = null;
		this.brushCel = new Cel(2, 2, COLORS.black);
	}
	inputActive(e) {
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let pCoords = CoreRenderer.getCoordinatesFromInputEvent(this.pE);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let linePoints = line(new Point(coords.x, coords.y), new Point(pCoords.x, pCoords.y));
		let spacing = -1000;
		if (spacing >= 0) spacing += 1;
		if(spacing < 0) spacing = Math.abs(1 / spacing);
		console.log(spacing);
		let scattering = 10;
		for(let ix = 0; ix < linePoints.length; ix += spacing) {
			let i = Math.floor(ix);
			let p = linePoints[i];
			p.x += Math.round((Math.random() * scattering) - (scattering / 2))
			p.y += Math.round((Math.random() * scattering) - (scattering / 2))
			layerCel.drawCel(this.brushCel, p.x, p.y, true);
			
		}
        this.pE = e;
	}
	inputStart(e) {
		this.pE = e;
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let dummyCel = new Cel(4, 4, COLORS.green);
		layerCel.drawCel(dummyCel, coords.x, coords.y, true);

		this.brushCel.fill(COLORS.random())

		
		let spacing = -100000;
		if (spacing >= 0) spacing += 1;
		if(spacing < 0) spacing = Math.abs(1 / spacing);
		console.log(spacing);
		let scattering = 10;
		let pp = {...coords};
		let p = coords;
		let ix = 0;

		setInterval(() => {
			if(ix > 1) return;
			ix += spacing;
			let i = Math.floor(ix);
			p.x += Math.round((Math.random() * scattering) - (scattering / 2))
			p.y += Math.round((Math.random() * scattering) - (scattering / 2))
			layerCel.drawLine(this.brushCel, p, pp, true);
			pp = {...p};
		}, 0.5);
	}
	inputEnd(e) {

    }
    inputPreview(e) {
		let coords = CoreRenderer.getCoordinatesFromInputEvent(e);
		let layer = LayerManager.getActiveLayer();
		let layerCel = layer.layerCel;
		let dummyCel = new Cel(4, 4, COLORS.green);
		//layerCel.tempDrawCel(dummyCel, coords.x, coords.y, true);
    }
}
