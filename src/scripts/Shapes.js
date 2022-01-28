


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
		points.push(new Point(parseInt(x1), y0));                                      /*   I. Quadrant */
		points.push(new Point(x0, y0));                                      /*  II. Quadrant */
		points.push(new Point(x0, y1));                                      /* III. Quadrant */
		points.push(new Point(parseInt(x1), y1));                                      /*  IV. Quadrant */
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
