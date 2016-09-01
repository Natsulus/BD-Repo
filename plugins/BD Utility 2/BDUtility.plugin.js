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

    off(eventName) {
        if (this.events[eventName]) Reflect.deleteProperty(this.events, eventName);
    }
}

class BDModal {
    constructor(options) {
        this.prefix = options.prefix;
    }

    show() {
        const span = $("<span>", {class: `${this.prefix}-modal-span`});

        span.append(this.createBackdrop(span));
        this.modal = this.constructModal();
        span.append(this.modal);

        $("#app-mount").find(">:first-child").append(span);
    }

    createBackdrop(span) {
        const backdrop = $("<div>", {
            class: "callout-backdrop",
            style: "opacity: 0; transform: translateZ(0px); background-color: rgb(0, 0, 0);",
            click(ev) {
                ev.stopImmediatePropagation();

                span.children(".callout-backdrop").animate({opacity: 0}, 100, "linear");
                span.children(".modal").animate({opacity: 0}, {
                    duration: 100,
                    easing: "linear",
                    progress: (anim, prog) => {
                        $(anim.elem).css("transform", `scale(${1 - 0.35 * prog})`);
                    },
                    complete() {
                        span.remove();
                    }
                });
            }
        });

        backdrop.animate({opacity: 0.85}, 100, "linear");

        return backdrop;
    }

    constructModal() {
        //
    }
}

class BDSettingsPanel {
    constructor(settings) {
        this.enabled = false;
        this.prefix = settings.prefix;
        this.name = settings.name;
        this.defaultPage = settings.defaultPage;

        this.settingsPanel = $("<div>", {
            id: `${this.prefix}-panel`,
            class: "settings-inner",
            css: {display: "none"}
        });

        this.settingsPanel.append(settings.content);

        const changeSettingsTab = tab => {
            this.lastTab = tab;

            $(`.${this.prefix}-tab`).removeClass("selected");
            $(`.${this.prefix}-page`).hide();
            $(`#${this.prefix}-${tab}-tab`).addClass("selected");
            $(`#${this.prefix}-${tab}-page`).show();

            // Add Unique Tab actions here
        };

        const showSettings = () => {
            $(".tab-bar-item").removeClass("selected");
            this.settingsButton.addClass("selected");
            $(".form .settings-right .settings-inner").hide();

            this.settingsPanel.show();

            if (typeof this.lastTab === "undefined") changeSettingsTab(this.defaultPage);
            else changeSettingsTab(this.lastTab);
        };

        // Create Tab Bar Button
        this.settingsButton = $("<div>", {
            class: `tab-bar-item ${this.prefix}-tab-bar-item`,
            text: this.name,
            id: `${this.prefix}-settings-new`,
            click(ev) {
                ev.stopImmediatePropagation();
                showSettings();
            }
        });
    }

    show() {
        if (this.enabled) {
            this.settingsPanel.hide();
            $(`#${this.prefix}-settings-new`).removeClass("selected");

            $(".tab-bar.SIDE .tab-bar-item:not(#bd-settings-new)").click(() => {
                $(".form .settings-right .settings-inner").first().show();
                this.settingsPanel.hide();
                $(`#${this.prefix}-settings-new`).removeClass("selected");
            });

            const setTabBar = setInterval(() => {
                const bdtab = $("#bd-settings-new");

                if (bdtab.length > 0) {
                    clearInterval(setTabBar);
                    $(".tab-bar.SIDE").append(this.settingsButton);
                    $(`#${this.prefix}-settings-new`).removeClass("selected");
                    bdtab.click(() => {
                        $(`#${this.prefix}-settings-new`).removeClass("selected");
                        this.settingsPanel.hide();
                    });
                }
            }, 100);

            $(".form .settings-right .settings-inner").last().after(this.settingsPanel);
        }
    }

    hide() {
        //
    }

    createPage(pageId) {
        // create page and tab
    }

    createSubPage(pageId, subPageId) {
        // create page and tab
    }

    createCategory(pageId, category) {
        // check parent.type for page/subpage
        // parent.name for selection
    }

    createSettings(parent, settings) {
        // check parent.type for page/subpage/category
        // parent.name for selection

        // construct settings
        // append/after settings to parent
    }

    createLog(parent, log) {
        // check parent.type for page/subpage/category
        // parent.name for selection

        // modify log
        // append/after log to parent
    }

    createCustom(parent, custom) {
        // check parent.type for page/subpage/category
        // parent.name for selection

        // append/after custom to parent
    }

    constructSettings() {
        this.settingsPanel = $("<div>", {
            id: `${this.prefix}-panel`,
            class: "settings-inner",
            css: {display: "none"}
        });

        // construct the settings
        // this.settingsPanel.append(settings);
    }

    updateCheckbox(checkbox) {
        const cb = $(checkbox).children().find(`input[type="checkbox"]`);
        const enabled = !cb.is(":checked");
        const id = cb.attr("id");

        cb.prop("checked", enabled);

        // do stuff
    }

    updateRadio(radio) {
        //
    }

    updateList(list) {
        //
    }

    updateSlider(slider) {
        //
    }

    updateTextbox(textbox) {
        //
    }

    updateSettings() {
        // get settings and save
    }
}

class BDContextItem {
    //
}

class BDContextManager {
    //
}

class BDUtils {
    constructor(name, style) {
        this.name = name;
        this.style = style || "font-weight: bold;";
    }

    log(...args) {
        console.log(`%c[${this.name}] `, this.style, ...args);
    }

    info(...args) {
        console.info(`%c[${this.name}] `, this.style, ...args);
    }

    warn(...args) {
        console.warn(`%c[${this.name}] `, this.style, ...args);
    }

    error(...args) {
        console.error(`%c[${this.name}] `, this.style, ...args);
    }

    getUser() {
        return this.utils.getReactProps($(".account-details")[0]).user;
    }

    getCreationTimestamp(id) {
        return (id / 4194304) + 1420070400000;
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

    getGithubJSON(user, repo, branch = "master", file) {
        return new Promise((resolve, reject) => {
            $.ajax({
                error(...err) {
                    reject(err);
                },
                success(data) {
                    resolve(JSON.parse(data));
                },
                type: "GET",
                url: `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${file}.json`
            });
        });
    }

    getGithubHash(user, repo, branch = "master") {
        return new Promise((resolve, reject) => {
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
                url: `https://api.github.com/repos/${user}/${repo}/commits/${branch}`
            });
        });
    }

    getCDNFile(user, repo, branch = "master", file) {
        return new Promise((resolve, reject) => {
            this.getGithubHash(branch).then(hash => {
                $.ajax({
                    error(...err) {
                        reject(err);
                    },
                    success(data) {
                        resolve(data);
                    },
                    type: "GET",
                    url: `https://rawcdn.githack.com/${user}/${repo}/${hash}/${file}`
                });
            }).catch(err => {
                reject(err);
            });
        });
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

    saveStorage(store, data) {
        localStorage.setItem(store, window.LZString.compress(JSON.stringify(data)));
    }

    loadStorage(store, def) { // only to be used on storage saved with saveStorage
        return localStorage.getItem(store) && JSON.parse(window.LZString.decompress(localStorage.getItem(store))) || def || {};
    }

    getReactData(node) {
        return node[Object.keys(node).find(key => {
            return key.startsWith("__reactInternalInstance");
        })];
    }

    getReactInstance(node) {
        return (data => {
            if (data) return data._currentElement._owner._instance;
        })(this.getReactData(node));
    }

    getReactProps(node) {
        return (data => {
            if (data) return data._currentElement._owner._instance.props;
        })(this.getReactData(node));
    }

    createModal() {
        //
    }

    initSettings(settings) {
        if (typeof settings === "object") {
            const jQueryInterval = setInterval(() => {
                if (window.jQuery) {
                    this.settingsPanel = new BDSettingsPanel(settings);
                    clearInterval(jQueryInterval);
                }
            }, 100);
        }
    }
}

class BDUtility {
    constructor() {
        const settings = {
            prefix: "bdutils",
            name: "BD Utility",
            defaultPage: "settings",
            content: "Temporary Content Test"
        };

        BDUtility.main = this;

        this.plugins = {};

        this.utils = this.init("BD Utility");
        this.utils.initSettings(settings);

        this.utils.event.on("userSettings", () => {
            $(".settings-actions .btn-confirm").after($(".change-log-button").detach());
            $(".change-log-button-container").remove();

            for (const plugin in this.plugins) if (this.plugins[plugin].settingsPanel) this.plugins[plugin].settingsPanel.show();
        });

        // Queue Mutations until BD Utility is started
        this.onLoad = {};
        this.onLoad.queue = [];
        this.onLoad.ready = false;

        const cookieInterval = setInterval(() => {
            if (window.pluginCookie && Reflect.has(window.pluginCookie, this.getName())) {
                if (!window.pluginCookie[this.getName()]) {
                    window.pluginCookie[this.getName()] = true;
                    window.pluginModule.savePluginData();
                    setTimeout(() => {
                        window.require("electron").remote.getCurrentWindow().reload(); // reload in case start doesn't get called
                    }, 1000);
                }
                clearInterval(cookieInterval);
            }
        }, 10);

        this.mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(ev => {
                if (this.onLoad.ready) this.eventObserver(ev);
                else this.onLoad.queue.push(ev);
            });
        });

        this.mutationObserver.observe(document, {
            childList: true,
            subtree: true
        });

        const panelInterval = setInterval(() => {
            if (this.utils.settingsPanel) {
                this.utils.settingsPanel.enabled = true;
                clearInterval(panelInterval);
            }
        }, 100);

        const injectInterval = setInterval(() => {
            if (window.BdApi) {
                const css = `
                    #bd-settings-new {
                        padding-top: 10px;
                        padding-bottom: 8px;
                    }
                    #bd-settings-new:after {
                        content: '';
                        position: absolute;
                        width: 20px;
                        height: 1px;
                        background-color: rgba(255, 255, 255, 0.1);
                        top: 0px;
                        left: 20px
                    }
                    .settings-actions .change-log-button {
                        opacity: 1;
                        color: #87909c;
                        display: inline-flex;
                        width: 50%;
                        font-size: 12px;
                    }`;

                window.BdApi.injectCSS("bd-utility", css);
                clearInterval(injectInterval);
            }
        }, 100);

        const scriptInterval = setInterval(() => {
            if (window.jQuery) {
                if ($("#lz-string").length === 0)
                    this.utils.loadScript("lz-string", "https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js");
                if ($("#jquery-getReact").length === 0)
                    this.utils.loadScript("jquery-getReact", "https://rawcdn.githack.com/Natsulus/BD-Repo/master/plugins/BD%20Utility/jquery.getReact.js");
                clearInterval(scriptInterval);
            }
        }, 100);
    }

    init(name, style) {
        this.plugins[name] = new BDUtils(name, style);
        this.plugins[name].event = new BDEventSystem();
        this.plugins[name].context = new BDContextManager();

        return this.plugins[name];
    }

    start() {
        setTimeout(() => {
            this.onLoad.ready = true;
            while(this.onLoad.queue.length > 0) this.eventObserver(this.onLoad.queue.shift());
        }, 1000); // 1 second buffer for other plugins
    }

    stop() {
        //
    }

    eventObserver(ev) {
        // Voice Join/Leave, Leaving doesn't provide user unfortunately
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.className.includes("channel-voice")) {
            if (ev.addedNodes[0].className && ev.addedNodes[0].className.includes("channel-voice-states")) {
                const props = this.utils.getReactProps(ev.addedNodes[0].childNodes[0]);

                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("joinVoiceChannel", ev.addedNodes[0], props.user, props.channel);
                }
            } else if (ev.removedNodes[0].className && ev.removedNodes[0].className.includes("channel-voice-states")) {
                const props = this.utils.getReactProps(ev.target);

                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("leaveVoiceChannel", ev.removedNodes[0], props.channel);
                }
            }
        }

        // Tooltips, can't get React Data of Owner unfortunately
        if (ev.target.className === "tooltips") {
            for (const plugin in this.plugins) {
                if (ev.addedNodes.length === 1) this.plugins[plugin].event.trigger("tooltipOver", ev.addedNodes[0]);
                else this.plugins[plugin].event.trigger("tooltipOff", ev.removedNodes[0]);
            }
        }

        // Switching Channel/Server, switchServerChannel for when switching server because can't get old channel
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.nodeName === "SPAN") {
            if (ev.target.className === "channel-name") {
                const oldProps = $(`a > .channel-name:contains(${ev.removedNodes[0].data})`).getReactProps()[0];
                const newProps = $(`a > .channel-name:contains(${ev.addedNodes[0].data})`).getReactProps()[0];

                for (const plugin in this.plugins) {
                    if (oldProps) this.plugins[plugin].event.trigger("switchTextChannel", ev.addedNodes[0], oldProps.channel, newProps.channel);
                    else this.plugins[plugin].event.trigger("switchServerChannel", ev.addedNodes[0], newProps.channel);

                    this.plugins[plugin].event.trigger("loadTextChannel", ev.addedNodes[0], newProps.channel);
                }
            }
            const props = this.utils.getReactProps(ev.target);

            if (Reflect.has(props, "guild")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("switchServer", ev.addedNodes[0], props.guild);
                    this.plugins[plugin].event.trigger("loadServer", ev.addedNodes[0], props.guild);
                }
            }
        }

        // Load Friend List Page
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.nodeName === "SECTION" && ev.target.className === "flex-horizontal flex-spacer") {
            if (ev.addedNodes[0].id === "friends") {
                $(ev.addedNodes[0]).find("div.scroller.friends-table-body > span").children().each((i, el) => {
                    const props = this.utils.getReactProps(el.childNodes[0]);

                    if (Reflect.has(props, "user")) {
                        for (const plugin in this.plugins) {
                            this.plugins[plugin].event.trigger("loadFriend", el, props.user, props.mutualGuilds);
                        }
                    }
                });


                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("loadFriendList", ev.addedNodes[0]);
                }
            }
        }

        // User Typing Notification
        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1 && ev.target.nodeName === "FORM" && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("typing")) {
            const props = this.utils.getReactProps(ev.target);

            if (Reflect.has(props, "channel")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("userTyping", ev.addedNodes[0], props.channel);
                }
            }
        }

        // Show Member List
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className === "channel-members-wrap" && ev.target.className === "content flex-spacer flex-horizontal") {
            for (const plugin in this.plugins) {
                this.plugins[plugin].event.trigger("showMemberList", ev.addedNodes[0]);
            }
        }

        // DM Page to Server
        if (ev.addedNodes.length === 1 && ev.target.className === "flex-vertical channels-wrap") {
            const props = this.utils.getReactProps(ev.addedNodes[0]);

            if (Reflect.has(props, "guild")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("loadServer", ev.addedNodes[0], props.guild);
                }
            }
        }

        // Load each new friend row
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("friends-row")) {
            const props = this.utils.getReactProps(ev.addedNodes[0].childNodes[0]);

            if (Reflect.has(props, "user")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("loadFriend", ev.addedNodes[0], props.user, props.mutualGuilds);
                }
            }
        }

        // Popouts
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("popout")) {
            if (ev.addedNodes[0].childNodes[0].className.includes("user-popout")) {
                const props = this.utils.getReactProps(ev.addedNodes[0].childNodes[0]);

                if (Reflect.has(props, "user")) {
                    for (const plugin in this.plugins) {
                        this.plugins[plugin].event.trigger("userPopout", ev.addedNodes[0], props.user);
                    }
                }
            } else if (ev.addedNodes[0].childNodes[0].className.includes("undefined")) {
                const props = this.utils.getReactProps(ev.addedNodes[0].childNodes[0]);

                if (Reflect.has(props, "channel")) {
                    for (const plugin in this.plugins) {
                        this.plugins[plugin].event.trigger("pinnedPopout", ev.addedNodes[0], props.channel);
                    }
                }
            } else if (ev.addedNodes[0].childNodes[0].className.includes("recent-mentions-popout")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("mentionsPopout", ev.addedNodes[0]);
                }
            }
        }

        // Load User to Member List
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("member") && ev.target.className.includes("scroller channel-members")) {
            const props = this.utils.getReactProps(ev.addedNodes[0]);

            if (Reflect.has(props, "user")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("loadMember", ev.addedNodes[0], props.user, props.activity);
                }
            }
        }

        // Context Menu
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("context-menu")) {
            if (ev.target.className.includes("item-subMenu")) {
                const props = this.utils.getReactProps(ev.target);

                if (props) {
                    for (const plugin in this.plugins) {
                        this.plugins[plugin].event.trigger("subContextMenu", ev.addedNodes[0], props);
                    }
                }
            }
            const props = this.utils.getReactProps(ev.addedNodes[0]);

            if (props) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("contextMenu", ev.addedNodes[0], props);
                }
            }
        }

        // Hide Member list
        if (ev.removedNodes.length === 1 && ev.removedNodes[0].className === "channel-members-wrap" && ev.target.className === "content flex-spacer flex-horizontal") {
            for (const plugin in this.plugins) {
                this.plugins[plugin].event.trigger("hideMemberList", ev.removedNodes[0]);
            }
        }

        // Message on Switch
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("messages-wrapper") && ev.target.className.includes("flex-spacer flex-vertical")) {
            $(ev.addedNodes[0]).find(".message").each((i, el) => {
                const props = this.utils.getReactProps(el);

                if (Reflect.has(props, "message")) {
                    for (const plugin in this.plugins) {
                        this.plugins[plugin].event.trigger("message", el, props.message, props.channel);
                    }
                }
            });
        }

        // New Message
        if (ev.addedNodes.length === 1 && ev.target.className.includes("scroller messages")) {
            $(ev.addedNodes[0]).find(".message").each((i, el) => {
                const props = this.utils.getReactProps(el);

                if (Reflect.has(props, "message")) {
                    for (const plugin in this.plugins) {
                        this.plugins[plugin].event.trigger("message", el, props.message, props.channel);
                    }
                }
            });
        }

        // User Settings Modal
        if (ev.addedNodes.length === 1 && ev.addedNodes[0].className && ev.addedNodes[0].className.includes("modal")) {
            if (ev.addedNodes[0].childNodes[0].childNodes[0].className.includes("user-settings-modal")) {
                for (const plugin in this.plugins) {
                    this.plugins[plugin].event.trigger("userSettings", ev.addedNodes[0]);
                }
            }
        }

        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 0) {
            //console.log(ev);
        }

        if (ev.addedNodes.length === 0 && ev.removedNodes.length === 1) {
            //console.log(ev);
        }

        if (ev.addedNodes.length === 1 && ev.removedNodes.length === 1) {
            //console.log(ev);
        }
    }

    /*
     Well Tested Events:
     - message
     - loadMember
     */

    /*
     To Do:
     - More Events
     - Do not pass Mutation Records, pass Nodes/Elements
     - Verify untested utility functions
     */

    // Meta Data //

    getName() {
        return "BD Utility";
    }

    getDescription() {
        return "Tons of Utility for Developers!";
    }

    getVersion() {
        return "2.0.0";
    }

    getAuthor() {
        return `<a href="https://github.com/Natsulus/BD-Repo" target="_BLANK">Natsulus</a>`;
    }

    load() {
        // Deprecated in v2, just use constructor
    }
}

(() => {
    const removeBDUtility = new MutationObserver(mutations => {
        mutations.forEach(ev => {
            if (ev.addedNodes.length !== 1) return;

            if (ev.addedNodes[0].id === "bd-pane") {
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