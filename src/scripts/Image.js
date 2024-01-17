import { MUL_UN8 } from "./Util.js";

export class Cel {
	constructor(width, height, color = [0, 0, 0, 0]) {
		this.width = width;
		this.height = height;
		this.data = new Array(width * height * 4).fill(0);
		this.layer = {
			updateTexture: () => {},
		};
		this.fill(...color);
	}
	rData() {
		return new Uint8Array(this.data);
	}
	clear() {
		this.data = new Array(this.width * this.height * 4).fill(0);
		this.layer.updateTexture();
	}
	fill(r, g, b, a) {
		let pixelData = [r, g, b, a];
		for (let i = 0; i < this.data.length; i += 4) {
			this.data.splice(i, 4, ...pixelData);
		}
		this.layer.updateTexture();
	}
	//draws a pixel in canvasSpace, 0:0 being top left. if the pixel is beyond the bounds of the cel, expand the cel array to accomodate.
	drawPixel(x, y, r, g, b, a) {
		let pixelData = [r, g, b, a];
		let index = (x + y * this.width) * 4;
		this.data.splice(index, 4, ...pixelData);
		this.layer.updateTexture();
	}
	drawRect(x, y, w, h, r, g, b, a) {
		let pixelData = [r, g, b, a];
		let rowData = new Array(w * 4).fill(0);
		for (let i = 0; i < w * 4; i += 4) {
			rowData.splice(i, 4, ...pixelData);
		}
		for (let i = 0; i < h; i++) {
			let index = (x + (y + i) * this.width) * 4;
			this.data.splice(index, w * 4, ...rowData);
		}
		this.layer.updateTexture();
	}
	drawCel(cel, x, y) {
		let xStart = Math.max(0, x);
		let yStart = Math.max(0, y);
		let xEnd = Math.min(this.width, x + cel.width);
		let yEnd = Math.min(this.height, y + cel.height);
		let celXStart = Math.max(0, -x);
		let celYStart = Math.max(0, -y);
		if (xStart >= xEnd || yStart >= yEnd) return;

		for (let i = yStart; i < yEnd; i++) {
			let index = (xStart + i * this.width) * 4;
			let celIndex = (celXStart + (i - yStart + celYStart) * cel.width) * 4;
			//this.data.splice(index, (xEnd - xStart) * 4, ...cel.data.slice(celIndex, celIndex + (xEnd - xStart) * 4));
			//instead of splicing, go through every pixel and composite with the alpha of the source pixel and the destination pixel
			//copy the way this blendfuncseparate works
			// gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
			//the destination will more than likely be a 0,0,0,0, so need to ensure that black isnt composited with the color. the color should be preserved.
			for (let j = xStart; j < xEnd; j++) {
				let destIndex = index + (j - xStart) * 4;
				let sourceIndex = celIndex + (j - xStart) * 4;

				let Rr, Rg, Rb, Ra;

				// code referenced from  https://github.com/loilo/color-blend/tree/master
				let Br = this.data[destIndex + 0];
				let Bg = this.data[destIndex + 1];
				let Bb = this.data[destIndex + 2];
				let Ba = this.data[destIndex + 3] / 255;

				let Sr = cel.data[sourceIndex + 0];
				let Sg = cel.data[sourceIndex + 1];
				let Sb = cel.data[sourceIndex + 2];
				let Sa = cel.data[sourceIndex + 3] / 255;

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

				this.data.splice(destIndex, 4, ...[Rr, Rg, Rb, Ra]);
			}
		}
		this.layer.updateTexture();
	}
}

export class LayerTexture {
	constructor(cel, w, h) {
		this.width = w;
		this.height = h;
		this.cel = cel;
		this.cel.layer = this;
		this.glTex = twgl.createTexture(gl, {
			mag: gl.NEAREST,
			min: gl.LINEAR,
			src: this.cel.rData(),
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
			this.cel.rData()
		);
	}
}
