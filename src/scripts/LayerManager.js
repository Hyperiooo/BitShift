import { LayerTexture, Cel } from "./ImageData.js";
import { Color, COLORS } from "./Util.js";
import { Point } from "./Shapes.js";
export class LayerManager {
	constructor() {
		this.layers = [];
        this.activeLayer = 0;
	}
	createLayer() {
		let layer = new Layer("Layer testing", null, null);
		this.layers.push(layer);
	}
    getActiveLayer() {
        return this.layers[this.activeLayer];
    }
}
export class Layer {
	/**
	 *
	 * @param {String} label
	 * @param {Uint8Array} data - pre-set image data for the layer texture/cel. by default, a layer has no cel attached?
	 * @param {Object} settings
	 */
	constructor(label, data, settings) {
        this.label = label;
        this.width = projectSize.w;
        this.height = projectSize.h;
		this.layerCel = new Cel(
			this.width,
			this.height,
			COLORS.clear
		);
        this.layerTexture = new LayerTexture(this.layerCel, projectSize.w, projectSize.h, this.label);
		this.layerTexture.updateTexture();
		CoreRenderer.addLayerTextureToRenderQueue(this.layerTexture, projectSize.w, projectSize.h, this.label);
	}
}
