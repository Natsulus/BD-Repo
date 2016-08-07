//META{"name":"CreationDate"}*//

class CreationDate {
    start() {
        const script = $("<script>", {
            type: "text/javascript",
            src: "https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js",
            id: "date-js"
        });

        $("head").append(script);

        const css = `.creation-date-wrapper {font-size: 12px; color: #fff; font-family: inherit; opacity: 0.6; margin-top: 10px;}`;

        BdApi.injectCSS("creation-date-css", css);
    }

    stop() {
        $("#date-js").remove();
        BdApi.clearCSS("creation-date-css");
    }

    observer(ev) {
        if (ev.addedNodes.length > 0 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("popout")
            && ev.addedNodes[0].childNodes.length > 0 && ev.addedNodes[0].childNodes[0].className.includes("user-popout")) {
            const user = this.getReactProps(ev.addedNodes[0].childNodes[0]).user;

            $(ev.addedNodes[0].childNodes[0]).find(".header")
                .append($("<div>", {
                    class: "creation-date-wrapper",
                    text: `Created on ${this.getCreationDate(user.id, "MMMM dS, yyyy")}`
                }));
        }
    }
    getReactInstance(node) {
        return node[Object.keys(node).find(key => {
            return key.startsWith("__reactInternalInstance");
        })];
    }

    getReactObject(node) {
        return (inst => {
            if (inst) return inst._currentElement._owner._instance;
        })(this.getReactInstance(node));
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
        return "1.0.0";
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

    getSettingsPanel() {
        // To come with next update
    }

    load() {
        // Deprecated in v2
    }

    unload() {
        // Deprecated in v2
    }
}