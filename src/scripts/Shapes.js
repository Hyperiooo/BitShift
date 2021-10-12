


class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Rect {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
}

function rectangle(sP, eP) {
	let allP = [];
	let lH = line(new Point(sP.x, eP.y), new Point(eP.x, eP.y))
	let lV = line(new Point(sP.x, sP.y), new Point(sP.x, eP.y))
	let tH = line(new Point(sP.x, sP.y), new Point(eP.x, sP.y))
	let tV = line(new Point(eP.x, sP.y), new Point(eP.x, eP.y))
	let l;
	for (l of lH) allP.push(l)
	for (l of lV) allP.push(l)
	for (l of tH) allP.push(l)
	for (l of tV) allP.push(l)
	return allP
}
function filledRectangle(sP, eP) {
	let allP = [];
	let lH = line(new Point(sP.x, eP.y), new Point(eP.x, eP.y))
	let lV = line(new Point(sP.x, sP.y), new Point(sP.x, eP.y))
	let tH = line(new Point(sP.x, sP.y), new Point(eP.x, sP.y))
	let tV = line(new Point(eP.x, sP.y), new Point(eP.x, eP.y))
	let l;
	for (l of lH) allP.push(l)
	for (l of lV) allP.push(l)
	for (l of tH) allP.push(l)
	for (l of tV) allP.push(l)
	for (let i = 0; i < lV.length; i++) {
		const p = lV[i];
		const p2 = tV[i];

		let lin = line(p, p2);
		for (let lo of lin) allP.push(lo)

	}
	return allP
}


function line(p1, p2) {
	/* this function calculates the points of the line with endpoints p1 &p2
	 */
	let points = [];
	let dx = Math.abs(p2.x - p1.x);
	let sx = p1.x < p2.x ? 1 : -1;
	let dy = -Math.abs(p2.y - p1.y);
	let sy = p1.y < p2.y ? 1 : -1;
	let err = dx + dy;

	let x1 = p1.x;
	let y1 = p1.y;
	while (true) {
		points.push(new Point(x1, y1));
		if (x1 == p2.x && y1 == p2.y) {
			break;
		}
		let e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			x1 += sx;
		}

		if (e2 <= dx) {
			err += dx;
			y1 += sy;
		}
	}
	return points;
}

function _sym45(points) {
	/* This is a helper function for circle which calculates points on all the 8 symmetries */
	let nPoints = [];

	Array.prototype.push.apply(nPoints, points);

	for (let p of points) {
		nPoints.push(new Point(p.y, p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.y, p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.x, p.y));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.x, -p.y));
	}
	for (let p of points) {
		//nPoints.push(new Point(-p.y, -p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(p.y, -p.x));
	}
	for (let p of points) {
		//nPoints.push(new Point(p.x, -p.y));
	}
	return nPoints;
}
function _sym8(points) {
	/* This is a helper function for circle which calculates points on all the 8 symmetries */
	let nPoints = [];

	Array.prototype.push.apply(nPoints, points);

	for (let p of points) {
		nPoints.push(new Point(p.y, p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.y, p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.x, p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.x, -p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.y, -p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(p.y, -p.x));
	}
	for (let p of points) {
		nPoints.push(new Point(p.x, -p.y));
	}
	return nPoints;
}

function _sym4(points) {
	/* This is a helper function for ellipse which calculates points on all the 4 symmetries */
	let nPoints = [];

	Array.prototype.push.apply(nPoints, points);

	for (let p of points) {
		nPoints.push(new Point(-p.x, p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(-p.x, -p.y));
	}
	for (let p of points) {
		nPoints.push(new Point(p.x, -p.y));
	}
	return nPoints;
}


function circle(r, pc) {
	let xm = pc.x
	let ym = pc.y
	let points = []
	var x = -r, y = 0, err = 2 - 2 * r;                /* bottom left to top right */
	do {
		points.push(new Point(xm - x, ym + y));                            /*   I. Quadrant +x +y */
		points.push(new Point(xm - y, ym - x));                            /*  II. Quadrant -x +y */
		points.push(new Point(xm + x, ym - y));                            /* III. Quadrant -x -y */
		points.push(new Point(xm + y, ym + x));                            /*  IV. Quadrant +x -y */
		r = err;
		if (r <= y) err += ++y * 2 + 1;                                   /* y step */
		if (r > x || err > y) err += ++x * 2 + 1;                         /* x step */
	} while (x < 0);
	return (points)
}

function filledCircle(r, pc) {
	let xm = pc.x
	let ym = pc.y
	let points = []
	for (let x = -r; x < r; x++) {
		let height = Math.sqrt((r * r) - x * x)

		for (let y = -height; y < height; y++) {
			points.push(new Point(Math.round(x + xm), Math.round(y + ym)));
		}
	}
	return points
}

function filledEllipseO(xc, yc, a, b) {
	var points = []
	/* e(x,y) = b^2*x^2 + a^2*y^2 - a^2*b^2 */
	var x = 0,
		y = b;
	var rx = x,
		ry = y;
	var width = 1;
	var height = 1;
	var a2 = a * a,
		b2 = b * b;
	var crit1 = -(a2 / 4 + (a % 2) + b2);
	var crit2 = -(b2 / 4 + (b % 2) + a2);
	var crit3 = -(b2 / 4 + (b % 2));
	var t = -a2 * y; /* e(x+1/2,y-1/2) - (a^2+b^2)/4 */
	var dxt = 2 * b2 * x,
		dyt = -2 * a2 * y;
	var d2xt = 2 * b2,
		d2yt = 2 * a2;

	function incx() {
		x++;
		dxt += d2xt;
		t += dxt;
	}

	function incy() {
		y--;
		dyt += d2yt;
		t += dyt;
	}

	if (b == 0) {
		points.push(new Rect(xc - a, yc, (2 * a + 1) + (xc - a), 1 + yc));
		return;
	}

	while (y >= 0 && x <= a) {
		if (t + b2 * x <= crit1 /* e(x+1,y-1/2) <= 0 */ || t + a2 * y <= crit3) {
			/* e(x+1/2,y) <= 0 */
			if (height == 1);
			else if (ry * 2 + 1 > (height - 1) * 2) {
				/* draw nothing */
				points.push(new Rect(xc - rx, yc - ry, width + xc - rx, height - 1 + yc - ry));
				points.push(new Rect(xc - rx, yc + ry + 1, width + xc - rx, 1 - height + yc + ry + 1));
				ry -= height - 1;
				height = 1;
			} else {
				points.push(new Rect(xc - rx, yc - ry, width + xc - rx, (ry * 2 + 1) + yc - ry));
				ry -= ry;
				height = 1;
			}
			incx();
			rx++;
			width += 2;
		} else if (t - a2 * y > crit2) {
			/* e(x+1/2,y-1) > 0 */
			incy();
			height++;
		} else {
			if (ry * 2 + 1 > height * 2) {
				points.push(new Rect(xc - rx, yc - ry, width + xc - rx, height + yc - ry));
				points.push(new Rect(xc - rx, yc + ry + 1, width + xc - rx, -height + yc + ry + 1));
			} else {
				points.push(new Rect(xc - rx, yc - ry, width + xc - rx, (ry * 2 + 1) + yc - ry));
			}
			incx();
			incy();
			rx++;
			width += 2;
			ry -= height;
			height = 1;
		}
	}

	if (ry > height) {
		points.push(new Rect(xc - rx, yc - ry, width + xc - rx, height + yc - ry));
		points.push(xc - rx, yc + ry + 1, width, -height);
	} else {
		points.push(new Rect(xc - rx, yc - ry, width + xc - rx, (ry * 2 + 1) + yc - ry));
	}
	return points
}

function ellipse(x0, y0, x1, y1) { 
	var ox0 = x0
	var oy0 = y0
	var ox1 = x1
	var oy1 = y1                             /* rectangular parameter enclosing the ellipse */
	var a = Math.abs(x1 - x0), b = Math.abs(y1 - y0), b1 = b & 1;        /* diameter */
	var dx = 4 * (1.0 - a) * b * b, dy = 4 * (b1 + 1) * a * a;              /* error increment */
	var err = dx + dy + b1 * a * a, e2;                             /* error of 1.step */

	if (x0 > x1) { x0 = x1; x1 += a; }        /* if called with swapped points */
	if (y0 > y1) y0 = y1;                                  /* .. exchange them */
	y0 += (b + 1) >> 1; y1 = y0 - b1;                              /* starting pixel */
	a = 8 * a * a; b1 = 8 * b * b;
	let points = []
	do {
		points.push(new Point(x1, y0));                                      /*   I. Quadrant */
		points.push(new Point(x0, y0));                                      /*  II. Quadrant */
		points.push(new Point(x0, y1));                                      /* III. Quadrant */
		points.push(new Point(x1, y1));                                      /*  IV. Quadrant */
		e2 = 2 * err;
		if (e2 <= dy) { y0++; y1--; err += dy += a; }                 /* y step */
		if (e2 >= dx || 2 * err > dy) { x0++; x1--; err += dx += b1; }       /* x */
	} while (x0 <= x1);

	while (y0 - y1 <= b) {                /* too early stop of flat ellipses a=1 */
		points.push(new Point(x0 - 1, y0));                         /* -> finish tip of ellipse */
		points.push(new Point(x1 + 1, y0++));
		points.push(new Point(x0 - 1, y1));
		points.push(new Point(x1 + 1, y1--));
	}
	return points
}


function filledEllipse(x0, y0, x1, y1) { 
	var ox0 = x0
	var oy0 = y0
	var ox1 = x1
	var oy1 = y1                             /* rectangular parameter enclosing the ellipse */
	var a = Math.abs(x1 - x0), b = Math.abs(y1 - y0), b1 = b & 1;        /* diameter */
	var dx = 4 * (1.0 - a) * b * b, dy = 4 * (b1 + 1) * a * a;              /* error increment */
	var err = dx + dy + b1 * a * a, e2;                             /* error of 1.step */

	if (x0 > x1) { x0 = x1; x1 += a; }        /* if called with swapped points */
	if (y0 > y1) y0 = y1;                                  /* .. exchange them */
	y0 += (b + 1) >> 1; y1 = y0 - b1;                              /* starting pixel */
	a = 8 * a * a; b1 = 8 * b * b;
	let points = []
	do {
		points.push(new Point(x1, y0));                                      /*   I. Quadrant */
		points.push(new Point(x0, y0));                                      /*  II. Quadrant */
		points.push(new Point(x0, y1));                                      /* III. Quadrant */
		points.push(new Point(x1, y1));                                      /*  IV. Quadrant */
		e2 = 2 * err;
		if (e2 <= dy) { y0++; y1--; err += dy += a; }                 /* y step */
		if (e2 >= dx || 2 * err > dy) { x0++; x1--; err += dx += b1; }       /* x */
	} while (x0 <= x1);

	while (y0 - y1 <= b) {                /* too early stop of flat ellipses a=1 */
		points.push(new Point(x0 - 1, y0));                         /* -> finish tip of ellipse */
		points.push(new Point(x1 + 1, y0++));
		points.push(new Point(x0 - 1, y1));
		points.push(new Point(x1 + 1, y1--));
	}
	points = [...new Set(points)]
	var highestY = oy1
	var lowestX = ox1
	var highestX = ox0
	points.forEach(el => {
		if(el.y != highestY) return
		if(lowestX > el.x) lowestX = el.x
		if(highestX < el.x) highestX = el.x
	});
	var lp = []
	var hp = []
	for (let i = 0; i < points.length; i++) {
		const el = points[i];
		if(el.x <= lowestX) lp.push(el)
		if(el.x >= highestX) hp.push(el)
	}
	let fp = []
	for (let i = 0; i < lp.length; i++) {
		const el = lp[i];
		fp.push(new Rect(el.x, el.y, hp[i].x + 1, hp[i].y))
	}
	return fp
}


function setPixel(x, y) {
	board.draw(x, y)
}
