module.exports = (Plugin, BD, Vendor) => {
	const {API, Events, Storage} = BD;
	const {$, React} = Vendor;
	
	class CreationDate extends Plugin {
		constructor(props) {
			super(props);
		}
		
		onStart() {
			const settingsCSS = $("<style>", {
				id: "creation-date-settings",
				value: `#creation-date-save-button {margin-left: 8px;} #creation-date-setting-css, #creation-date-setting-format {width: 420px;}`
			});
			const wrapperCSS = $("<style>", {
				id: "creation-date-wrapper",
				value: `.creation-date-wrapper {${Storage.getSetting("CSS")}}`
			});

			$("head").append(settingsCSS, wrapperCSS);
			
			Events.on("mutation", this.observer);
			Events.on("user-popout", this.popoutHandler);
			
			return true;
		}
		
		onStop() {
			$("#creation-date-settings, #creation-date-wrapper").remove();
			
			Events.off("mutation", this.observer);
			Events.off("user-popout", this.popoutHandler);
			
			return true;
		}
		
		onSave() {
			//
		}
		
		observer(ev) {
			// Popouts
			if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("popout")) {
				if (ev.addedNodes[0].childNodes[0].className.includes("user-popout")) {
					const props = window.Reflection.getProps(window.Reflection.getReactInternalInstance(ev.addedNodes[0].childNodes[0])._currentElement);

					if (Reflect.has(props, "user")) {
						for (const plugin in this.plugins)
							Events.emit("user-popout", ev.addedNodes[0], props.user);
					}
				}
			}
		}
		
		popoutHandler(ev, user) {
			const display = Storage.getSetting("Format");
			const format = display.match(/\$\((.*)\)\$/);
			const date = this.getCreationDate(user.id, format[1]);

			const header = $(ev.addedNodes[0].childNodes[0]).find(".header")

			if (header[0].classList.length > 1) {
				header.find(".activity").after($("<div>", {
					class: "creation-date-wrapper",
					text: display.replace(format[0], date)
				}));
			} else {
				header.find(".username-wrapper").append($("<div>", {
					class: "creation-date-wrapper",
					text: display.replace(format[0], date)
				}));
			}
		}

		getCreationDate(id, format) {
			return window._bd.moment(this.getCreationTimestamp(id)).format(format);
		}

		getCreationTimestamp(id) {
			return (id / 4194304) + 1420070400000;
		}
	}
	
	return CreationDate;
}