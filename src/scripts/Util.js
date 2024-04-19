export function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}

export function distance(x1, x2, y1, y2) {
	return Math.hypot(x2 - x1, y2 - y1);
}
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export function truncate(input) {
	if (input.length > 30) {
		return input.substring(0, 27) + "...";
	}
	return input;
}

export function convertToVerboseHex(hex) {
	hex = hex.replace("#", "");
	if (hex.length == 3) {
		return (
			"#" +
			hex.charAt(0) +
			hex.charAt(0) +
			hex.charAt(1) +
			hex.charAt(1) +
			hex.charAt(2) +
			hex.charAt(2) +
			"ff"
		);
	} else if (hex.length == 4) {
		return (
			"#" +
			hex.charAt(0) +
			hex.charAt(0) +
			hex.charAt(1) +
			hex.charAt(1) +
			hex.charAt(2) +
			hex.charAt(2) +
			hex.charAt(3) +
			hex.charAt(3)
		);
	} else if (hex.length == 6) {
		return "#" + hex + "ff";
	} else if (hex.length == 8) {
		return "#" + hex;
	} else {
		return "#" + hex;
	}
}

export function invertColor(bgColor) {
	var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
	var r = parseInt(color.substring(0, 2), 16); // hexToR
	var g = parseInt(color.substring(2, 4), 16); // hexToG
	var b = parseInt(color.substring(4, 6), 16); // hexToB
	var uicolors = [r / 255, g / 255, b / 255];
	var c = uicolors.map((col) => {
		if (col <= 0.03928) {
			return col / 12.92;
		}
		return Math.pow((col + 0.055) / 1.055, 2.4);
	});
	var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
	return L > 0.179 ? "#000000" : "#ffffff";
}

export function isValidHex(color) {
	if (!color || typeof color !== "string") return false;

	if (color.substring(0, 1) === "#") color = color.substring(1);

	switch (color.length) {
		case 3:
			return /^[0-9A-F]{3}$/i.test(color);
		case 4:
			return /^[0-9A-F]{4}$/i.test(color);
		case 6:
			return /^[0-9A-F]{6}$/i.test(color);
		case 8:
			return /^[0-9A-F]{8}$/i.test(color);
		default:
			return false;
	}

	return false;
}

export function isValidNum(str) {
	if (typeof str != "string") return false;
	return !isNaN(str) && !isNaN(parseFloat(str));
}

export function hexToRGB(hex) {
	hex = hex.replace("#", "");
	if (hex.length == 3) {
		hex += "f";
	} else if (hex.length == 6) {
		hex += "ff";
	}
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b, a) {
		return r + r + g + g + b + b + (a || "ff") + (a || "ff");
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
		hex
	);
	return result
		? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
				parseInt(result[4], 16),
		  ]
		: null;
}

export function HSLToHSV(hsla) {
	var h = hsla[0];
	var s = hsla[1];
	var l = hsla[2];
	var a = hsla[3];
	const hsv1 = (s * (l < 50 ? l : 100 - l)) / 100;
	const hsvS = hsv1 === 0 ? 0 : ((2 * hsv1) / (l + hsv1)) * 100;
	const hsvV = l + hsv1;
	return [h, hsvS, hsvV, a];
}

export function HSVToHSL(hsva) {
	var h = hsva[0];
	var s = hsva[1] / 100;
	var v = hsva[2] / 100;
	var a = hsva[3];
	var l = ((2 - s) * v) / 2;

	if (l != 0) {
		if (l == 1) {
			s = 0;
		} else if (l < 0.5) {
			s = (s * v) / (l * 2);
		} else {
			s = (s * v) / (2 - l * 2);
		}
	}

	return [h, s * 100, l * 100, a];
}

export function RGBToHSV(rgba) {
	var r = rgba[0];
	var g = rgba[1];
	var b = rgba[2];
	var a = rgba[3];
	let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
	rabs = r / 255;
	gabs = g / 255;
	babs = b / 255;
	(v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
	diffc = (c) => (v - c) / 6 / diff + 1 / 2;
	percentRoundFn = (num) => Math.round(num * 100) / 100;
	if (diff == 0) {
		h = s = 0;
	} else {
		s = diff / v;
		rr = diffc(rabs);
		gg = diffc(gabs);
		bb = diffc(babs);

		if (rabs === v) {
			h = bb - gg;
		} else if (gabs === v) {
			h = 1 / 3 + rr - bb;
		} else if (babs === v) {
			h = 2 / 3 + gg - rr;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}
	return [
		Math.round(h * 360),
		percentRoundFn(s * 100),
		percentRoundFn(v * 100),
		(a / 255) * 100,
	];
}

export function HSLToRGB(hsla) {
	var h = hsla[0] / 360;
	var s = hsla[1] / 100;
	var l = hsla[2] / 100;
	var a = hsla[3];
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return [
		Math.round(r * 255),
		Math.round(g * 255),
		Math.round(b * 255),
		Math.round((a / 100) * 255),
	];
}

export function RGBToHex(r, g, b, a) {
	if (a != undefined)
		return intToHex(r) + intToHex(g) + intToHex(b) + intToHex(a);
	else return intToHex(r) + intToHex(g) + intToHex(b);
}

export function intToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
export class Color {
	constructor(data) {
		this.rgba = {};
		this.hsva = {};
		this.hsla = {};
		this.rgbaarr = [];
		this.hex = "";
		if (data.r != undefined) {
			if (data.a == undefined) {
				data.a = 255;
			}
			this.rgba = {
				r: clamp(data.r, 0, 255),
				g: clamp(data.g, 0, 255),
				b: clamp(data.b, 0, 255),
				a: clamp(data.a, 0, 255),
			};
			var hexFromRGB = RGBToHex(
				this.rgba.r,
				this.rgba.g,
				this.rgba.b,
				this.rgba.a
			);
			var hsvFromRGB = RGBToHSV([
				this.rgba.r,
				this.rgba.g,
				this.rgba.b,
				this.rgba.a,
			]);
			var hslFromHSV = HSVToHSL(hsvFromRGB);
			this.hex = hexFromRGB;
			this.hsva = {
				h: hsvFromRGB[0],
				s: hsvFromRGB[1],
				v: hsvFromRGB[2],
				a: hsvFromRGB[3],
			};
			this.hsla = {
				h: hslFromHSV[0],
				s: hslFromHSV[1],
				l: hslFromHSV[2],
				a: hslFromHSV[3],
			};
		}
		if (data.v != undefined) {
			if (data.a == undefined) {
				data.a = 100;
			}
			this.hsva = {
				h: clamp(data.h, 0, 360),
				s: clamp(data.s, 0, 100),
				v: clamp(data.v, 0, 100),
				a: clamp(data.a, 0, 100),
			};
			var hslFromHSV = HSVToHSL([
				this.hsva.h,
				this.hsva.s,
				this.hsva.v,
				this.hsva.a,
			]);
			var rgbFromHSL = HSLToRGB(hslFromHSV);
			var hexFromRGB = RGBToHex(
				rgbFromHSL[0],
				rgbFromHSL[1],
				rgbFromHSL[2],
				rgbFromHSL[3]
			);
			this.hsla = {
				h: hslFromHSV[0],
				s: hslFromHSV[1],
				l: hslFromHSV[2],
				a: hslFromHSV[3],
			};
			this.rgba = {
				r: rgbFromHSL[0],
				g: rgbFromHSL[1],
				b: rgbFromHSL[2],
				a: rgbFromHSL[3],
			};
			this.hex = hexFromRGB;
		}
		if (data.l != undefined) {
			if (data.a == undefined) {
				data.a = 100;
			}
			this.hsla = {
				h: clamp(data.h, 0, 360) || 0,
				s: clamp(data.s, 0, 100) || 0,
				l: clamp(data.l, 0, 100) || 0,
				a: clamp(data.a, 0, 100) || 100,
			};
			var hsvFromHSL = HSLToHSV([
				this.hsla.h,
				this.hsla.s,
				this.hsla.l,
				this.hsla.a,
			]);
			var rgbFromHSL = HSLToRGB([
				this.hsla.h,
				this.hsla.s,
				this.hsla.l,
				this.hsla.a,
			]);
			var hexFromRGB = RGBToHex(
				rgbFromHSL[0],
				rgbFromHSL[1],
				rgbFromHSL[2],
				rgbFromHSL[3]
			);
			this.hsva = {
				h: hsvFromHSL[0],
				s: hsvFromHSL[1],
				v: hsvFromHSL[2],
				a: hsvFromHSL[3],
			};
			this.rgba = {
				r: rgbFromHSL[0],
				g: rgbFromHSL[1],
				b: rgbFromHSL[2],
				a: rgbFromHSL[3],
			};
			this.hex = hexFromRGB;
		}
		if (Array.isArray(data)) {
			if (data.length == 3) {
				data.push(255);
			}
			this.rgba = {
				r: clamp(data[0], 0, 255),
				g: clamp(data[1], 0, 255),
				b: clamp(data[2], 0, 255),
				a: clamp(data[3], 0, 255),
			};
			var hexFromRGB = RGBToHex(
				this.rgba.r,
				this.rgba.g,
				this.rgba.b,
				this.rgba.a
			);
			var hsvFromRGB = RGBToHSV([
				this.rgba.r,
				this.rgba.g,
				this.rgba.b,
				this.rgba.a,
			]);
			var hslFromHSV = HSVToHSL(hsvFromRGB);
			this.hex = hexFromRGB;
			this.hsva = {
				h: hsvFromRGB[0],
				s: hsvFromRGB[1],
				v: hsvFromRGB[2],
				a: hsvFromRGB[3],
			};
			this.hsla = {
				h: hslFromHSV[0],
				s: hslFromHSV[1],
				l: hslFromHSV[2],
				a: hslFromHSV[3],
			};
		}
		if (typeof data === "string") {
			if (isValidHex(data)) {
				this.hex = data;
				var rgbFromHex = hexToRGB(this.hex);
				var hsvFromRGB = RGBToHSV(rgbFromHex);
				var hslFromHSV = HSVToHSL(hsvFromRGB);
				this.rgba = {
					r: rgbFromHex[0],
					g: rgbFromHex[1],
					b: rgbFromHex[2],
					a: rgbFromHex[3],
				};
				this.hsva = {
					h: hsvFromRGB[0],
					s: hsvFromRGB[1],
					v: hsvFromRGB[2],
					a: hsvFromRGB[3],
				};
				this.hsla = {
					h: hslFromHSV[0],
					s: hslFromHSV[1],
					l: hslFromHSV[2],
					a: hslFromHSV[3],
				};
			}
		}
		if (!this.hex.startsWith("#")) {
			this.hex = "#" + this.hex;
		}
		this.hex = convertToVerboseHex(this.hex);
		this.rgb = {
			r: this.rgba.r,
			g: this.rgba.g,
			b: this.rgba.b,
		};
		this.hsv = {
			h: this.hsva.h,
			s: this.hsva.s,
			v: this.hsva.v,
		};
		this.hsl = {
			h: this.hsla.h,
			s: this.hsla.s,
			l: this.hsla.l,
		};
		this.rgbaarr = [this.rgba.r, this.rgba.g, this.rgba.b, this.rgba.a];
		this.hexh = this.hex.replace("#", "");
		this.hexa = this.hex.substring(0, this.hex.length - 2);
		this.hexah = this.hexa.replace("#", "");
		this.contrastingColor = invertColor(this.hexa);
		//this.name = getColorName(this.hex.substring(0, this.hex.length - 2)).name;
	}
}

export const COLORS = {
	white: new Color("#ffffff"),
	black: new Color("#000000"),
	red: new Color("#ff0000"),
	green: new Color("#00ff00"),
	blue: new Color("#0000ff"),
	yellow: new Color("#ffff00"),
	cyan: new Color("#00ffff"),
	magenta: new Color("#ff00ff"),
	silver: new Color("#c0c0c0"),
	gray: new Color("#808080"),
	clear: new Color("#00000000"),
	random: function () {return new Color({r: Math.floor(Math.random() * 255),g: Math.floor(Math.random() * 255),b: Math.floor(Math.random() * 255),a: 255})}
};