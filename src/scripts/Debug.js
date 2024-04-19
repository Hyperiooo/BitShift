export class DebugWindow {
	constructor() {
		this.window = document.getElementById("debug-window");
		this.logger = document.getElementById("debug-logger");
		this.values = document.getElementById("debug-values");
		this.data = {};
        this.valEls = {}
		this.enabled = false;
	}
	log(...message) {
		if(!this.enabled) return;
		this.logger.innerHTML += message.join(" ") + "<br>";
		this.logger.scrollTop = this.logger.scrollHeight;
	}
	upsertValue(key, ...value) {
		if(!this.enabled) return;
        if(this.valEls[key] === undefined) {
            let newEl = document.createElement("div");
            this.values.appendChild(newEl);
            this.valEls[key] = newEl;
        } 
        this.valEls[key].innerHTML = key + ": " + value.map((e) => {
            if(typeof e === "number"){ return e.toFixed(2)}
            else if(typeof e === "object"){return this.stringifyObject(e)}
            else{return e}
        }).join(", ");

	}
	enableDebug() {
		this.enabled = true;
	}
}
