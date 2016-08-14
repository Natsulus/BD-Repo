//META{"name":"BDUtility"}*//

class BDEvent {
    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }
}

class BDEventSystem {
    constructor() {
        this.events = {};
    }

    registerEvent(eventName) {
        this.events[eventName] = new BDEvent(eventName);
    }

    trigger(eventName, ...eventArgs) {
        if (this.events[eventName]) {
            this.events[eventName].callbacks.forEach(callback => {
                callback(...eventArgs);
            });
        }
    }

    on(eventName, callback) {
        if (!this.events[eventName]) this.registerEvent(eventName);
        this.events[eventName].registerCallback(callback);
    }
}

class BDUtility extends BDEventSystem {
    constructor(options) {
        super();
        if (!window.LZString) {
            const waitInterval = setInterval(() => {
                if (window.LZString) clearInterval(waitInterval);
                if (window.jQuery) {
                    this.loadScript("lz-string", "https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js");
                    clearInterval(waitInterval);
                }
            }, 200);
        }

        this.repository = options && options.repository;
        this.plugin = options && options.plugin;
        this.console = options && options.console || options && options.plugin && options.plugin.getName() || "BD Utility";
        this.style = options && options.style || "font-weight: bold;";
    }

    log(...args) {
        console.log(`%c[${this.console || "BD Utility"}] `, this.style, ...args);
    }

    info(...args) {
        console.info(`%c[${this.console || "BD Utility"}] `, this.style, ...args);
    }

    warn(...args) {
        console.warn(`%c[${this.console || "BD Utility"}] `, this.style, ...args);
    }

    error(...args) {
        console.error(`%c[${this.console || "BD Utility"}] `, this.style, ...args);
    }

    loadScript(item, url) {
        const script = $("<script>", {
            id: item,
            src: url,
            type: "text/javascript"
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
                dataType: "json",
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(data);
                },
                type: "GET",
                url
            });
        });
    }

    getGithubJSON(branch = "master", file) {
        return new Promise((resolve, reject) => {
            if (!this.repository) reject("No Repository Defined");
            $.ajax({
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(JSON.parse(data));
                },
                type: "GET",
                url: `https://raw.githubusercontent.com/${this.repository}/${branch}/${file}.json`
            });
        });
    }

    getGithubHash(branch = "master") {
        return new Promise((resolve, reject) => {
            if (!this.repository) reject("No Repository Defined");
            $.ajax({
                beforeSend: xhr => {
                    xhr.setRequestHeader("Accept", "application/vnd.github.v3+json");
                },
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(data.sha);
                },
                type: "GET",
                url: `https://api.github.com/repos/${this.repository}/commits/${branch}`
            });
        });
    }

    getCDNFile(options) {
        return new Promise((resolve, reject) => {
            if (!this.repository) reject("No Author or Repository Defined");
            this.getGithubHash(options.branch).then(hash => {
                $.ajax({
                    error(...err) {
                        reject(err);
                    },
                    success(data) {
                        resolve(data);
                    },
                    type: "GET",
                    url: `https://rawcdn.githack.com/${this.repository}/${hash}/${options.file}`
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    saveStorage(store, data) {
        localStorage.setItem(store, window.LZString.compress(JSON.stringify(data)));
    }

    loadStorage(store, def) { // only to be used on storage saved with saveStorage
        return localStorage.getItem(store) && JSON.parse(window.LZString.decompress(localStorage.getItem(store))) || def || {};
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

    eventObserver(ev) {
        // Voice Join/Leave, Leaving doesn't provide user unfortunately
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.className.includes("channel-voice")) {
            if (ev.addedNodes[0].className && ev.addedNodes[0].className.includes("channel-voice-states")) {
                const props = this.getReactProps(ev.addedNodes[0].childNodes[0]);

                return this.trigger("joinVoiceChannel", ev, props.user, props.channel);
            } else if (ev.removedNodes[0].className && ev.removedNodes[0].className.includes("channel-voice-states")) {
                const props = this.getReactProps(ev.target);

                return this.trigger("leaveVoiceChannel", ev, props.channel);
            }
        }

        // Tooltips, can't get React Data of Owner unfortunately
        if (ev.target.className === "tooltips") {
            if (ev.addedNodes.length === 1) return this.trigger("tooltipOver", ev);

            return this.trigger("tooltipOff", ev);
        }

        // Switching Channel/Server, switchServerChannel for when switching server because can't get old channel
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.nodeName === "SPAN") {
            if (ev.target.className === "channel-name") {
                const oldProps = $(`a > .channel-name:contains(${ev.removedNodes[0].data})`).getReactProps()[0];
                const newProps = $(`a > .channel-name:contains(${ev.addedNodes[0].data})`).getReactProps()[0];

                if (oldProps) this.trigger("switchTextChannel", ev, oldProps.channel, newProps.channel);
                else this.trigger("switchServerChannel", ev, newProps.channel);

                return this.trigger("loadTextChannel", ev, newProps.channel);
            }
            const props = this.getReactProps(ev.target);

            if (Reflect.has(props, "guild")) {
                this.trigger("switchServer", ev, props.guild);
                this.trigger("loadServer", ev, props.guild);

                return;
            }
        }

        // Load Friend List Page
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.nodeName === "SECTION" && ev.target.className === "flex-horizontal flex-spacer") {
            if (ev.addedNodes[0].id === "friends") {
                $(ev.addedNodes[0]).find("div.scroller.friends-table-body > span").children().each((i, el) => {
                    const props = this.getReactProps(el.childNodes[0]);

                    if (Reflect.has(props, "user")) {
                        this.trigger("loadFriend", el, props.user, props.mutualGuilds);
                    }
                });

                return this.trigger("loadFriendList", ev);
            }
        }

        // User Typing Notification
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.nodeName === "FORM" && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("typing")) {
            const props = this.getReactProps(ev.target);

            if (Reflect.has(props, "channel")) {
                return this.trigger("userTyping", ev, props.channel);
            }
        }

        // Show Member List
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className === "channel-members-wrap" && ev.target.className === "content flex-spacer flex-horizontal") {
            return this.trigger("showMemberList", ev);
        }

        // DM Page to Server
        if (ev.addedNodes.length === 1 && ev.target.className === "flex-vertical channels-wrap") {
            const props = this.getReactProps(ev.addedNodes[0]);

            if (Reflect.has(props, "guild")) {
                return this.trigger("loadServer", ev, props.guild);
            }
        }

        // Load each new friend row
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("friends-row")) {
            const props = this.getReactProps(ev.addedNodes[0].childNodes[0]);

            if (Reflect.has(props, "user")) {
                return this.trigger("loadFriend", ev, props.user, props.mutualGuilds);
            }
        }

        // Popouts
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("popout")) {
            if (ev.addedNodes[0].childNodes[0].className.includes("user-popout")) {
                const props = this.getReactProps(ev.addedNodes[0].childNodes[0]);

                if (Reflect.has(props, "user")) {
                    return this.trigger("userPopout", ev, props.user);
                }
            } else if (ev.addedNodes[0].childNodes[0].className.includes("undefined")) {
                const props = this.getReactProps(ev.addedNodes[0].childNodes[0]);

                if (Reflect.has(props, "channel")) {
                    return this.trigger("pinnedPopout", ev, props.channel);
                }
            } else if (ev.addedNodes[0].childNodes[0].className.includes("recent-mentions-popout")) {
                return this.trigger("mentionsPopout", ev);
            }
        }

        // Load User to Member List
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("member") && ev.target.className.includes("scroller channel-members")) {
            const props = this.getReactProps(ev.addedNodes[0]);

            if (Reflect.has(props, "user")) {
                return this.trigger("loadMemberListUser", ev, props.user, props.activity);
            }
        }

        // Context Menu
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("context-menu")) {
            if (ev.target.className.includes("item-subMenu")) {
                const props = this.getReactProps(ev.target);

                if (props) return this.trigger("subContextMenu", ev, props);
            }
            const props = this.getReactProps(ev.addedNodes[0]);

            if (props) return this.trigger("contextMenu", ev, props);
        }

        // Hide Member list
        if (ev.removedNodes.length === 1 && ev.removedNodes[0].className === "channel-members-wrap" && ev.target.className === "content flex-spacer flex-horizontal") {
            return this.trigger("hideMemberList", ev);
        }

        // Message on Switch
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("messages-wrapper") && ev.target.className.includes("flex-spacer flex-vertical")) {
            $(ev.addedNodes[0]).find(".message").each((i, el) => {
                const props = this.getReactProps(el);

                if (Reflect.has(props, "message")) {
                    this.trigger("message", el, props.message, props.channel);
                }
            });

            return;
        }

        // New Message
        if (ev.addedNodes.length === 1 && ev.target.className.includes("scroller messages")) {
            $(ev.addedNodes[0]).find(".message").each((i, el) => {
                const props = this.getReactProps(el);

                if (Reflect.has(props, "message")) {
                    this.trigger("message", el, props.message, props.channel);
                }
            });

            return;
        }

        //console.log(ev);
    }

    // Meta Data //

    getName() {
        return "BD Utility";
    }

    getDescription() {
        return "Utility functions for other plugins. No need to enable.";
    }

    getVersion() {
        return "1.1.0";
    }

    getAuthor() {
        return `<a href="https://github.com/Natsulus/BD-Repo" target="_BLANK">Natsulus</a>`;
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

    const currentVersion = BDUtility.prototype.getVersion();
    // get latest BD Utility version
    // compare version with BDUtility.prototype.getVersion()
    // display notice if new version
})(); // use IIFE to avoid polluting global namespace

(function loadReactPlugins($) {
    if (window.jQuery) {
        $.fn.getReactInstance = function() {
            const arr = [];

            this.each((i, el) => {
                arr.push(el[Object.keys(el).find(key => {
                    return key.startsWith("__reactInternalInstance");
                })]);
            });

            return arr;
        };

        $.fn.getReactObject = function() {
            const arr = [];

            this.each((i, el) => {
                const inst = el[Object.keys(el).find(key => {
                    return key.startsWith("__reactInternalInstance");
                })];

                if (inst) arr.push(inst._currentElement._owner._instance);
                else arr.push(inst);
            });

            return arr;
        };

        $.fn.getReactProps = function() {
            const arr = [];

            this.each((i, el) => {
                const inst = el[Object.keys(el).find(key => {
                    return key.startsWith("__reactInternalInstance");
                })];

                if (inst) arr.push(inst._currentElement._owner._instance.props);
                else arr.push(inst);
            });

            return arr;
        };
    } else {
        setTimeout(() => {loadReactPlugins(window.jQuery);}, 50);
    }
})(window.jQuery);