//META{"name":"CreationDate"}*//

class CreationDate {
    start() {
        const script =  $("<script>", {
            type: "text/javascript",
            src: "https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js",
            id: "date-js"
        });

        $("head").append(script);

        this.defaultSettings = {
            css: "font-size: 12px; color: #fff; font-family: inherit; opacity: 0.6; margin-bottom: 10px;",
            format: "Created on $(dS of MMM, yyyy)$"
        };

        this.settings = this.loadSettings();

        window.BdApi.injectCSS("creation-date-settings", `#creation-date-save-button {margin-left: 8px;} #creation-date-setting-css, #creation-date-setting-format {width: 420px;}`);
        window.BdApi.injectCSS("creation-date-wrapper", `.creation-date-wrapper {${this.settings.css}}`);
    }

    stop() {
        $("#date-js").remove();
        window.BdApi.clearCSS("creation-date-settings");
        window.BdApi.clearCSS("creation-date-wrapper");
    }

    observer(ev) {
		if (ev.addedNodes.length > 0 && ev.addedNodes[0].className && typeof ev.addedNodes[0].className === "string" && ev.addedNodes[0].className.includes("popout") 
			&& ev.addedNodes[0].childNodes.length > 0 && ev.addedNodes[0].childNodes[0].className.includes("userPopout")) {
				const user = this.getOwnerInstance(ev.addedNodes[0].childNodes[0], {}).props.user;
				const match = this.settings.format.match(/\$\((.*)\)\$/);
				const date = this.getCreationDate(user.id, match[1]);

				const activity = $(ev.addedNodes[0].childNodes[0]).find(".headerActivityText-3qBQRo");
				
				if (activity[0].childNodes.length > 0) {
					activity.parent().after($("<div>", {
						class: "creation-date-wrapper",
						text: this.settings.format.replace(match[0], date)
					}));
				} else {
					activity.parent().before($("<div>", {
						class: "creation-date-wrapper",
						text: this.settings.format.replace(match[0], date)
					}));
				}
				
			}
    }

    getSettingsPanel() {
        const settings = this.loadSettings();
        let html = "<h3>Settings</h3><br>";

        html += "CSS<br>";
        html += `<input id="creation-date-setting-css" type="text" value="${settings.css}"><br><br>`;
        html += "Format<br>";
        html += `<input id="creation-date-setting-format" type="text" value="${settings.format}"><br><br>`;
        html += `<br><button id="creation-date-reset-button" onclick="BdApi.getPlugin('Creation Date').resetSettings(this)">Reset</button>`;
        html += `<button id="creation-date-save-button" onclick="BdApi.getPlugin('Creation Date').saveSettings(this)">Save</button>`;

        return html;
    }

    resetSettings(button) {
        this.settings = $.extend(true, {}, this.defaultSettings);
        document.getElementById("creation-date-setting-css").value = this.settings.css;
        document.getElementById("creation-date-setting-format").value = this.settings.format;
        bdPluginStorage.set("CreationDate", "settings", JSON.stringify(this.settings));
        this.reloadCSS();

        button.innerHTML = "Settings Resetted!";
        setTimeout(() => {button.innerHTML = "Reset";}, 1000);
    }

    saveSettings(button) {
        this.settings.css = document.getElementById("creation-date-setting-css").value;
        this.settings.format = document.getElementById("creation-date-setting-format").value;
        bdPluginStorage.set("CreationDate", "settings", JSON.stringify(this.settings));
        this.reloadCSS();
        button.innerHTML = "Settings Saving!";
        setTimeout(() => {button.innerHTML = "Save";}, 1000);
    }

    loadSettings() {
        return bdPluginStorage.get("CreationDate", "settings") && JSON.parse(bdPluginStorage.get("CreationDate", "settings")) || $.extend(true, {}, this.defaultSettings);
    }

    reloadCSS() {
        window.BdApi.clearCSS("creation-date-wrapper");
        window.BdApi.injectCSS("creation-date-wrapper", `.creation-date-wrapper {${this.settings.css}}`);
    }
	
	getInternalInstance(e) {
		return e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];
	}
	
    getOwnerInstance(e, {include, exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
        if (e === undefined) {
            return undefined;
        }
        const excluding = include === undefined;
        const filter = excluding ? exclude : include;

        function getDisplayName(owner) {
            const type = owner._currentElement.type;
            const constructor = owner._instance && owner._instance.constructor;
            return type.displayName || constructor && constructor.displayName || null;
        }

        function classFilter(owner) {
            const name = getDisplayName(owner);
            return (name !== null && !!(filter.includes(name) ^ excluding));
        }

        for (let prev, curr = this.getInternalInstance(e); !_.isNil(curr); prev = curr, curr = curr._hostParent) {
            if (prev !== undefined && !_.isNil(curr._renderedChildren)) {
                let owner = Object.values(curr._renderedChildren)
                    .find(v => !_.isNil(v._instance) && v.getHostNode() === prev.getHostNode());
                if (!_.isNil(owner) && classFilter(owner)) {
                    return owner._instance;
                }
            }

            if (_.isNil(curr._currentElement)) {
                continue;
            }
            let owner = curr._currentElement._owner;
            if (!_.isNil(owner) && classFilter(owner)) {
                return owner._instance;
            }
        }

        return null;
    };
	
    getCreationDate(id, format) {
        return new Date(this.getCreationTimestamp(id)).toString(format);
    }

    getCreationTimestamp(id) {
        return (id / 4194304) + 1420070400000;
    }

    getName() {
        return "Creation Date";
    }

    getDescription() {
        return "See when a user's account was created.";
    }

    getVersion() {
        return "1.1.3";
    }

    getAuthor() {
        return "Natsulus";
    }

    onMessage() {
        // v2
    }

    onSwitch() {
        // Better to use observer
    }

    load() {
        // Deprecated in v2
    }

    unload() {
        // Deprecated in v2
    }
}