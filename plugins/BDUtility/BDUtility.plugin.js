//META{"name":"BDUtility"}*//

class BDUtility {
    constructor(options) {
        this.repository = options && options.repository;
        this.plugin = options && options.plugin;
        this.console = options && options.console || options && options.plugin && options.plugin.getName() || "BD Utility";
        this.style = options && options.style || "font-weight: bold;";
    }

    log(...args) {
        console.log(`%c[${this.console}] `, this.style, ...args);
    }

    info(...args) {
        console.info(`%c[${this.console}] `, this.style, ...args);
    }

    warn(...args) {
        console.warn(`%c[${this.console}] `, this.style, ...args);
    }

    error(...args) {
        console.error(`%c[${this.console}] `, this.style, ...args);
    }

    loadScript(item, url) {
        const script = $("<script>", {
            type: "text/javascript",
            src: url,
            id: item
        });

        $("head").append(script);
        this.info("Loaded:", item);
    }

    unloadScript(item) {
        $(`#${item}`).remove();
        this.info("Unloaded:", item);
    }

    getUser() {
        return this.getReactProps($(".account-details")[0]).user;
    }

    getJSON(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                dataType: "json",
                url,
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(data);
                }
            });
        });
    }

    getGithubJSON(branch = "master", file) {
        return new Promise((resolve, reject) => {
            if (!this.repository) reject("No Repository Defined");
            $.ajax({
                type: "GET",
                url: `https://raw.githubusercontent.com/${this.repository}/${branch}/${file}.json`,
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    getGithubHash(branch = "master") {
        return new Promise((resolve, reject) => {
            if (!this.repository) reject("No Repository Defined");
            $.ajax({
                type: "GET",
                url: `https://api.github.com/repos/${this.repository}/commits/${branch}`,
                beforeSend: xhr => {
                    xhr.setRequestHeader("Accept", "application/vnd.github.v3+json");
                },
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(data.sha);
                }
            });
        });
    }

    getCDNFile(options) {
        return new Promise((resolve, reject) => {
            if (!this.repository) reject("No Author or Repository Defined");
            this.getGithubHash(options.branch).then(hash => {
                $.ajax({
                    type: "GET",
                    url: `https://rawcdn.githack.com/${this.repository}/${hash}/${options.file}`,
                    error(...err) {
                        reject(err);
                    },
                    success(data) {
                        resolve(data);
                    }
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    saveStorage(store, data) {
        localStorage.setItem(store, JSON.stringify(data));
    }

    loadStorage(store, def) {
        return JSON.parse(localStorage.getItem(store)) || def || {};
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
        return (obj => {
            if (obj) return obj.props;
        })(this.getReactObject(node));
    }

    // Meta Data //

    getName() {
        return "BD Utility";
    }

    getDescription() {
        return "Utility functions for other plugins. No need to enable.";
    }

    getVersion() {
        return "1.0.0";
    }

    getAuthor() {
        return "Natsulus";
    }

    load() {
        // Deprecated in v2
    }
}

(() => {
    const removeBDUtility = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length !== 1) return;

            if (mutation.addedNodes[0].id === "bd-pane") {
                $(".bda-name:contains(BD Utility)").parents("li").remove();
                removeBDUtility.disconnect();
            }
        });
    });

    removeBDUtility.observe(document.body, {
        childList: true,
        subtree: true
    });

    // get BD Utility version
    // compare version with BDUtility.prototype.getVersion()
    // display notice if new version
})(); // use IIFE to avoid polluting global namespace