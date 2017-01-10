//META{"name":"CreationDate"}*//

class CreationDate {
    start() {
        const script = $("<script>", {
            type: "text/javascript",
            src: "https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js",
            id: "date-js"
        });

        $("head").append(script);

        this.defaultSettings = {
            css: "font-size: 12px; color: #fff; font-family: inherit; opacity: 0.6; margin-top: 10px;",
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
        if (ev.addedNodes.length > 0 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("popout")
            && ev.addedNodes[0].childNodes.length > 0 && ev.addedNodes[0].childNodes[0].className.includes("user-popout")) {
            const user = this.getReactProps(ev.addedNodes[0].childNodes[0]).user;
            const match = this.settings.format.match(/\$\((.*)\)\$/);
            const date = this.getCreationDate(user.id, match[1]);

            const header = $(ev.addedNodes[0].childNodes[0]).find(".header")

            if (header[0].classList.length > 1) {
                header.find(".activity").after($("<div>", {
                    class: "creation-date-wrapper",
                    text: this.settings.format.replace(match[0], date)
                }));
            } else {
                header.find(".username-wrapper").append($("<div>", {
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

    getReactInstance(node) {
        return node[Object.keys(node).find(key => {
            return key.startsWith("__reactInternalInstance");
        })];
    }

    getReactProps(node) {
        return (inst => {
            if (inst) return inst._currentElement._owner._instance.props;
        })(this.getReactInstance(node));
    }

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
        return "1.1.2";
    }

    getAuthor() {
        return `<a href="https://github.com/Natsulus/BD-Repo" target="_BLANK">Natsulus</a>`;
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