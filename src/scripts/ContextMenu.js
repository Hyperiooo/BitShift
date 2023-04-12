class ContextMenu {
  constructor(el, options) {
    this.el = el;
    options = options || {};
    this.options = {
      buttons: options.buttons || [],
      touchTarget: options.touchTarget || el,
      touchBehavior: options.touchBehavior || "longPress",
      touchDelay: options.touchDelay || 500,
      beforeTouchContext:
        options.beforeTouchContext ||
        function () {
          return true;
        },
      beforeClickContext:
        options.beforeClickContext ||
        function () {
          return true;
        },
    };
    this.init();
    this.popperTarget = {
      getBoundingClientRect: this.generateGetBoundingClientRect(),
    };
    this.popInstance = Popper.createPopper(this.popperTarget, this.menu, {
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
    });
  }
  init() {
    this.contextHandler = function (e) {
      e.preventDefault();
      this.render(e, "click");
    };
    this.contextHandler = this.contextHandler.bind(this);
    this.el.addEventListener("contextmenu", this.contextHandler);
    this.touchTimeout = null;
    this.movedelta
    this.startX
    this.startY
    this.options.touchTarget.addEventListener("touchstart", (e) => {
      console.log(e);
      this.movedelta = 0
      this.startX = e.touches[0].clientX
      this.startY = e.touches[0].clientY
      if (this.options.touchBehavior === "longPress") {
        this.touchTimeout = setTimeout(() => {
          this.render(e, "touch");
        }, this.options.touchDelay);
      } else if (this.options.touchBehavior === "tap") {
        this.render(e, "touch");
      }
    });
    this.options.touchTarget.addEventListener("touchmove", e=>{
      this.movedelta += Math.abs(e.touches[0].clientX - this.startX) + Math.abs(e.touches[0].clientY - this.startY)
      if(this.movedelta > 10) {
        clearTimeout(this.touchTimeout)
      }
    })
    this.options.touchTarget.addEventListener("touchend", (e) => {
      if (this.options.touchBehavior === "longPress") {
        clearTimeout(this.touchTimeout);
      }
    });

    this.menu = document.createElement("div");
    this.menu.classList.add("context-menu");
    document.body.appendChild(this.menu);
    this.options.buttons.forEach((option) => {
		if(option.type == "divider"){
			const item = document.createElement("div");
			item.classList.add("context-menu-divider");
			this.menu.appendChild(item);
			return

		}
      const item = document.createElement("button");
      item.classList.add("context-menu-item");
	  if(option.color) {
		
		item.classList.add("txt-col-" + option.color);
	  }
      item.innerHTML = `<i class="hi-${option.icon}"></i>${option.title}`;
      item.onclick = () => {
        option.action();
        this.menu.classList.remove("context-menu-visible");
      };
      this.menu.appendChild(item);
    });

    document.body.addEventListener("pointerdown", (e) => {
      if (
        e.target == this.el ||
        e.target == this.options.touchTarget ||
        e.target == this.menu ||
        e.target.parentElement == this.menu
      )
        return;
      this.menu.classList.remove("context-menu-visible");
    });
  }
  render(e, inputDevice) {
    if (this.options.beforeTouchContext())
      if (inputDevice === "click") {
        this.popperTarget.getBoundingClientRect =
          this.generateGetBoundingClientRect(e.clientX, e.clientY);
        this.menu.classList.remove("context-menu-mobile");
        this.menu.classList.add("context-menu-visible");
      } else if (inputDevice === "touch") {
        this.popperTarget.getBoundingClientRect = function () {
          return this.options.touchTarget.getBoundingClientRect();
        }.bind(this);
        this.menu.classList.add("context-menu-mobile");
        this.menu.classList.toggle("context-menu-visible");
      }

    this.popInstance.update();
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
