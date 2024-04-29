import { line } from "./Shapes.js";
export class Cel {
	constructor(width, height, color = COLORS.clear) {
		this.width = width;
		this.height = height;
		this.data = new Uint8Array(width * height * 4).fill(0);
		this.layer = {
			updateTexture: () => {},
		};
		this.fill(color);

		this.addedToUpdateQueue = false;
	}
	clear() {
		this.data.fill(0);
		this.addCelToTextureUpdateQueue();
	}
	fill(color) {
		let pixelData = color.rgbaarr;
		for (let i = 0; i < this.data.length; i += 4) {
			this.data.set(pixelData, i);
		}
		this.addCelToTextureUpdateQueue();
	}
	//draws a pixel in canvasSpace, 0:0 being top left.
	//TODO: if the pixel is beyond the bounds of the cel, expand the cel array to accomodate.
	drawPixel(x, y, color) {
		let pixelData = color.rgbaarr;
		let index = (x + y * this.width) * 4;
		this.data.set(pixelData, index);
		this.addCelToTextureUpdateQueue();
	}
	//TODO: make this use the rect class
	drawRect(x, y, w, h, color) {
		let pixelData = color.rgbaarr;
		let rowData = new Array(w * 4).fill(0);
		for (let i = 0; i < w * 4; i += 4) {
			rowData.splice(i, 4, ...pixelData);
		}
		for (let i = 0; i < h; i++) {
			let index = (x + (y + i) * this.width) * 4;
			this.data.set(rowData, index);
		}
		this.addCelToTextureUpdateQueue();
	}
	//TODO: make this use the point class
	drawCel(cel, x, y, center) {
		if (center) {
			x -= Math.floor(cel.width / 2);
			y -= Math.floor(cel.height / 2);
		}
		let xStart = Math.max(0, x);
		let yStart = Math.max(0, y);
		let xEnd = Math.min(this.width, x + cel.width);
		let yEnd = Math.min(this.height, y + cel.height);
		let celXStart = Math.max(0, -x);
		let celYStart = Math.max(0, -y);
		if (xStart >= xEnd || yStart >= yEnd) return;

		const destData = this.data;
		const sourceData = cel.data;
		const sourceWidth = cel.width;

		for (let i = yStart; i < yEnd; i++) {
			let destIndex = (xStart + i * this.width) * 4;
			let sourceIndex =
				(celXStart + (i - yStart + celYStart) * sourceWidth) * 4;
			let destRowOffset = (this.width - (xEnd - xStart)) * 4;

			for (let j = xStart; j < xEnd; j++) {
				let Rr, Rg, Rb, Ra;

				let Br = destData[destIndex + 0];
				let Bg = destData[destIndex + 1];
				let Bb = destData[destIndex + 2];
				let Ba = destData[destIndex + 3] / 255;

				let Sr = sourceData[sourceIndex + 0];
				let Sg = sourceData[sourceIndex + 1];
				let Sb = sourceData[sourceIndex + 2];
				let Sa = sourceData[sourceIndex + 3] / 255;

				Ra = Sa + Ba - Sa * Ba;

				Rr = Sr;
				Rg = Sg;
				Rb = Sb;

				Rr =
					(1 - Sa / Ra) * Br + (Sa / Ra) * Math.round((1 - Ba) * Sr + Ba * Rr);
				Rg =
					(1 - Sa / Ra) * Bg + (Sa / Ra) * Math.round((1 - Ba) * Sg + Ba * Rg);
				Rb =
					(1 - Sa / Ra) * Bb + (Sa / Ra) * Math.round((1 - Ba) * Sb + Ba * Rb);

				Ra *= 255;

				destData[destIndex + 0] = Rr;
				destData[destIndex + 1] = Rg;
				destData[destIndex + 2] = Rb;
				destData[destIndex + 3] = Ra;

				destIndex += 4;
				sourceIndex += 4;
			}

			destIndex += destRowOffset;
		}

		this.addCelToTextureUpdateQueue();
	}
	drawLine(cel, p1, p2, center) {
		//generate line pixels
		let linePoints = line(p1, p2);
		linePoints.forEach((p) => {
			this.drawCel(cel, p.x, p.y, center);
		});
	}
	addCelToTextureUpdateQueue() {
		if (window.CoreRenderer === undefined || this.addedToUpdateQueue) return;
		CoreRenderer.textureUpdateQueue.push(this.updateTexture.bind(this));
		this.addedToUpdateQueue = true;
	}
	updateTexture() {
		this.layer.updateTexture();
		this.addedToUpdateQueue = false;
	}
}

export class LayerTexture {
	constructor(cel, w, h, label) {
		this.width = w;
		this.height = h;
		this.cel = cel;
		this.label = label;
		this.cel.layer = this;
		this.glTex = twgl.createTexture(gl, {
			mag: gl.NEAREST,
			min: gl.LINEAR,
			src: this.cel.data,
			width: this.width,
			height: this.height,
		});
	}
	updateTexture() {
		gl.bindTexture(gl.TEXTURE_2D, this.glTex);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			this.width,
			this.height,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			this.cel.data
		);
	}
}
