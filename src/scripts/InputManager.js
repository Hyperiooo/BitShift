export class InputManager {
    constructor() {
        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
        window.addEventListener('pointerdown', this.pointerDown.bind(this));
        window.addEventListener('pointerup', this.pointerUp.bind(this));
        window.addEventListener('pointermove', this.pointerMove.bind(this));
        window.addEventListener('wheel', this.wheel.bind(this));

    }
    keyDown(e) {
        DebugWindow.log("KeyDown: ", e.key);
    }
    keyUp(e) {
        DebugWindow.log("KeyUp: ", e.key);
    }
    pointerDown(e) {
        DebugWindow.upsertValue("Mouse Button", "Down");

    }
    pointerUp(e) {
        DebugWindow.upsertValue("Mouse Button", "None");

    }
    pointerMove(e) {
        DebugWindow.upsertValue("Mouse Position", e.x, e.y);
    }

    wheel(e) {
        
    }

}