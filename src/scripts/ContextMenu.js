class ContextMenu {
	constructor(el, options) {
		this.el = el;
        options = options || {};
		this.options = {
			buttons: options.buttons || [],
			touchTarget:options.touchTarget || el,
			touchBehavior: options.touchBehavior|| "longPress" ,
			touchDelay:options.touchDelay ||  500,
		};
		this.init();
        this.popperTarget = {
            getBoundingClientRect: this.generateGetBoundingClientRect(),
          }
        this.popInstance = Popper.createPopper(
			this.popperTarget,
			this.menu,
			{
				placement: "left",
				modifiers: [
					{
						name: "preventOverflow",
						options: {
							mainAxis: true, // true by default
							altAxis: true, // false by default
							padding: 55,
						},
					},

					{
						name: "offset",
						options: {
							offset: [0, 10],
						},
					},
					{
						name: "arrow",
						options: {
							element: this.arrow,
						},
					},
				],
			}
		);
	}
	init() {
		this.contextHandler = function (e) {
			e.preventDefault();
			this.render(e, "click");
		};
		this.contextHandler = this.contextHandler.bind(this);
		this.el.addEventListener("contextmenu", this.contextHandler);
        this.touchTimeout = null;
        this.options.touchTarget.addEventListener("touchstart", (e) => {
            console.log(e)
            if (this.options.touchBehavior === "longPress") {
                this.touchTimeout = setTimeout(() => {
                    this.render(e, "touch");
                }, this.options.touchDelay);
            } else if (this.options.touchBehavior === "tap") {
                this.render(e, "touch");
            }
        });
        this.options.touchTarget.addEventListener("touchend", (e) => {
            if (this.options.touchBehavior === "longPress") {
                clearTimeout(this.touchTimeout);
            }
        })

		this.menu = document.createElement("div");
		this.menu.classList.add("context-menu");
		document.body.appendChild(this.menu);
		this.options.buttons.forEach((option) => {
			const item = document.createElement("button");
			item.classList.add("context-menu-item");
			item.innerHTML = option.title;
			item.addEventListener("click", option.action);
			this.menu.appendChild(item);
		});
	}
	render(e, inputDevice) {
		this.menu.classList.add("context-menu-visible");

		if (inputDevice === "click") {
			this.popperTarget.getBoundingClientRect = this.generateGetBoundingClientRect(e.clientX, e.clientY);
		}else if(inputDevice === "touch"){
            notify.log('touchinput')
			this.popperTarget.getBoundingClientRect = function(){return this.options.touchTarget.getBoundingClientRect()}.bind(this)
        }

        this.popInstance.update()
	}
	 generateGetBoundingClientRect(x = 0, y = 0) {
        return () => ({
          width: 0,
          height: 0,
          top: y,
          right: x,
          bottom: y,
          left: x,
        });
      }
}


window.addEventListener("pointerdown", (e) => {
    document.querySelectorAll(".context-menu-visible").forEach(e=>{e.classList.remove("context-menu-visible")});
});