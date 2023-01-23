var rainbow = [
	//red
	"#ff8a8a",
	"#ffc87a",
	"#f3ff8a",
	"#8affc0",
	"#8ae2ff",
	"#c28aff",
];

var HyperIDGradient = ["#ffda45", "#ff7644", "#bc49ff", "#7de9ff"];

var BitShiftGradient = [
	"#3e88ff",
	"#2741ff",
	"#8fffff",
	"#4ac3ff",
	"#50fffa",
	"#3386ff",
];
var WaveShapeGradient = [
	"#ff3e9b",
	"#af15ff",
	"#ff9e7e",
	"#ff3f88",
	"#ff7a4d",
	"#ff21ca",
];

class Background {
	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		this.totalParticles = 15;
		this.particles = [];
		this.maxRadius = 1200;
		this.minRadius = 600;

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();
		window.requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = window.innerWidth;
		this.stageHeight = window.innerHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.createParticles();
	}
	createParticles() {
		let curColor = 0;
		this.particles = [];
		for (let i = 0; i < this.totalParticles; i++) {
			const item = new GlowParticle(
				Math.random() * this.stageWidth,
				Math.random() * this.stageHeight,
				Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
				colors[curColor]
			);
			if (++curColor >= colors.length) {
				curColor = 0;
			}

			this.particles[i] = item;
		}
	}
	animate() {
		window.requestAnimationFrame(this.animate.bind(this));
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.totalParticles; i++) {
			var item = this.particles[i];
			item.animate(this.ctx, this.stageWidth, this.stageHeight);
		}
	}
}

const PI2 = Math.PI * 2;
var speed = 5;

class GlowParticle {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;

		this.vx = Math.random() * 4;
		this.vy = Math.random() * 4;

		this.sinValue = Math.random();
	}
	animate(ctx, stageWidth, stageHeight) {
		this.sinValue += 0.01;
		this.radius += Math.sin(this.sinValue);
		this.x += this.vx;
		this.y += this.vy;

		if (this.x < 0) {
			this.vx *= -1;
			this.x += speed;
		} else if (this.x > stageWidth) {
			this.vx *= -1;
			this.x -= speed;
		}

		if (this.y < 0) {
			this.vy *= -1;
			this.y += speed;
		} else if (this.y > stageHeight) {
			this.vy *= -1;
			this.y -= speed;
		}

		ctx.beginPath();
		const g = ctx.createRadialGradient(
			this.x,
			this.y,
			this.radius * 0.01,
			this.x,
			this.y,
			this.radius
		);
		g.addColorStop(0, this.color);
		g.addColorStop(1, this.color + "00");
		ctx.fillStyle = g;
		ctx.arc(this.x, this.y, Math.abs(this.radius), 0, PI2, false);
		ctx.fill();
	}
}
var colors;
window.onload = function () {};
