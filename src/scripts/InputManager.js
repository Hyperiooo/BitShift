export class InputManager {
	constructor(drawingSurface) {
		/**
		 * This is essentially the main canvas - if an input is on here, it is related to drawing or manipulating the content on the canvas
		 */
		this.drawingSurface = drawingSurface;
		window.addEventListener("keydown", this.keyDown.bind(this));
		window.addEventListener("keyup", this.keyUp.bind(this));
		window.addEventListener("pointerdown", this.pointerDown.bind(this));
		window.addEventListener("pointerup", this.pointerUp.bind(this));
		window.addEventListener("pointermove", this.pointerMove.bind(this));
		window.addEventListener("wheel", this.wheel.bind(this));

		window.addEventListener("touchstart", this.preventDefault, {
			passive: false,
		});
		window.addEventListener("touchend", this.preventDefault, {
			passive: false,
		});
		window.addEventListener("touchmove", this.touchMove.bind(this), { passive: false });

		this.clickBegan = false;
		this.isDrawingSurface = false;

		this.azimuthAngle = 0;
		this.altitudeAngle = 0;
	}
	preventDefault(e) {
		e.preventDefault();
	}
	keyDown(e) {}
	keyUp(e) {}
	touchMove(e) {
		e.preventDefault();
		this.azimuthAngle = e.touches[0].azimuthAngle;
		this.altitudeAngle = e.touches[0].altitudeAngle;
	}
	pointerDown(e) {
		this.active = true; //TODO: adapt this so that multiple presses via different pointer id's are possible - only update respective pointers etc.
		/**general tool notes. dont know where to put so i put here
		 * split out input into files
		 *
		 * # inputmanager
		 * general input. handles gestures, hand, keyboard, mouse, etc. handles key
		 * combos and the likes. ofshoots the inputs to other submodules
		 * if a touch/mouse input is on the drawing canvas, send it over to the drawmanager
		 *
		 * # kbmanager
		 * handles the registry of shortcuts and the detection of them
		 *
		 * # drawmanager
		 * handles input when it relates to the draw canvas.
		 * this is then offshoots the input to the toolmanager.currentTool()
		 *
		 * # toolmanager
		 * handles the registry of tools. contains useful functions to set the tool, add a tool, etc.
		 * exposed api for modding
		 * takes in input and then gives it to the required tool
		 * "momentary" tools for, say, holding alt to eyedropper
		 *
		 * # tool file
		 * this would have a standard tool class, complete with beginoperation, operate(point, previouspoint), endoperation.
		 * tools operate would probably actually take in thec urrent and previous point? to then calculate the lines
		 * between input events, as well as linearly interpolating pressure/azimuth/altitude between events to have a smooth transition
		 * example of the brush engine:
		 *
		 * # brush engine
		 * would take in an array of points (calculated by the tool file) and operate on every single point. if the spacing of the brush (distance)
		 * between points) is positive, you have i+= distance. (e.g. if spacing = 2, i+= 2). if negative, i += 1 / Math.abs(distance)
		 * and then inside of the loop, calculate the index by flooring it.
		 * then you draw each cel. cels have properties similar to procreate. youd have to add hue shifting, scaling, rotating to cels
		 * so that this could work, but that can be used elsewhere\
		 *
		 *
		 * for ui, theres a very in depth slider object i have in mind
		 * you can specify how many handles it has (range), the start and end points, the step size. you can define snapping points where
		 * the input snaps to. it would slow down if you pull away from the slider.
		 * i envision the brush settings to have pressure/azimuth/altitude/randomness available on each parameter. this would be easy or hard idk
		 * you can define a range of what each would do to the control, its additive (maybe multiplicative?) this would be easy as everything can be mapped to 0-1
		 *
		 * # layermanager
		 * manages the layers
		 */
		if (e.target == this.drawingSurface) {
			//drawing events
			this.isDrawingSurface = true;
			ToolManager.getActiveTool().inputStart(e);
		}
		let buttonTypes = ["Left", "Middle", "Right"];
		Debug.upsertValue("Mouse Button", buttonTypes[e.button]);
	}
	pointerUp(e) {
		this.active = false;
		this.isDrawingSurface = true;
		Debug.upsertValue("Mouse Button", "None");
		ToolManager.getActiveTool().inputEnd(e);
	}
	pointerMove(e) {
		Debug.upsertValue("Mouse Position", e.x, e.y);
		Debug.upsertValue("Pointer Type", e.pointerType);
		Debug.upsertValue("Pointer Pressure", e.pressure);
		Debug.upsertValue("Pointer azimuth", this.azimuthAngle);
		Debug.upsertValue("Pointer altitude", this.altitudeAngle);

		console.log("-", e);
		if (this.isDrawingSurface && this.active) {
			//drawing events
			ToolManager.getActiveTool().inputActive(e);
		} else if (e.target == this.drawingSurface && !this.active) {
			ToolManager.getActiveTool().inputPreview(e);
		}
	}

	wheel(e) {}
}
