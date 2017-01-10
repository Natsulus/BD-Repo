//META{"name":"CustomEmotes"}*//

function CustomEmotes() {}

CustomEmotes.observer = null;

CustomEmotes.settings = null;

CustomEmotes.settingsButton = null;
CustomEmotes.settingsPanel = null;
CustomEmotes.settingsLastTab = null;
CustomEmotes.animationSpeed = 0.04;
CustomEmotes.emoteLists = {};
CustomEmotes.emoteLinks = {};
CustomEmotes.emoteToggle = {};
CustomEmotes.updateLog = [];
CustomEmotes.isReady = false;

CustomEmotes.prototype.changeTab = function(tab) {
    CustomEmotes.settingsLastTab = tab;

    //var controlGroups = $("#ce-control-groups");
    $(".ce-tab").removeClass("selected");
    $(".ce-pane").hide();
    $("#" + tab).addClass("selected");
    $("#" + tab.replace("tab", "pane")).show();

    switch (tab) {
        case "ce-settings-tab":
            break;
        case "ce-emotes-tab":
            break;
        case "ce-updates-tab":
            break;
    }
};

CustomEmotes.updateSettings = function(checkbox) {
    var cb = $(checkbox).children().find('input[type="checkbox"]');
    var enabled = !cb.is(":checked");
    var id = cb.attr("id");
    cb.prop("checked", enabled);
    CustomEmotes.settings[id] = enabled;
    CustomEmotes.prototype.saveSettings();
    switch (id) {
        case "enable-emotes":
            if (enabled) {
                $(".chat").each(function() {
                    CustomEmotes.observer.observe(this, {
                        childList: true,
                        characterData: true,
                        attributes: false,
                        subtree: true
                    });
                });
                CustomEmotes.processChat();
            } else {
                CustomEmotes.observer.disconnect();
                $(".emotewrapper").replaceWith(function() {
                    return $(this).attr("tooltip");
                });
                $(".ce-emotes-scanned").removeClass("ce-emotes-scanned");
            }
            break;
        case "enable-tooltips":
            if (enabled) {
                $(".emotewrapper[tooltip]").addClass("emote-tooltip");
            } else {
                $(".emotewrapper[tooltip]").removeClass("emote-tooltip");
            }
            break;
    }
};

CustomEmotes.updateEmoteList = function (checkbox) {
    var cb = $(checkbox);
    var enabled = cb.is(":checked");
    var id = cb.attr("id");
    CustomEmotes.emoteToggle[id] = enabled;
    localStorage.setItem("customEmoteToggles", JSON.stringify(CustomEmotes.emoteToggle));

    CustomEmotes.observer.disconnect();
    $(".emotewrapper").replaceWith(function() {
        return $(this).attr("tooltip");
    });
    $(".ce-emotes-scanned").removeClass("ce-emotes-scanned");

    $(".chat").each(function() {
        CustomEmotes.observer.observe(this, {
            childList: true,
            characterData: true,
            attributes: false,
            subtree: true
        });
    });
    CustomEmotes.processChat();
};

CustomEmotes.AddList = function (form) {
    CustomEmotes.loadList(form["emoteURLText"].value);
    form["emoteURLText"].value = "https://";
};

CustomEmotes.createSettings = function() {
    CustomEmotes.settingsPanel = $("<div/>", {
        id: "ce-pane",
        class: "settings-inner",
        css: {
            "display": "none"
        }
    });

    var settingsInner = '<div class="scroller-wrap">' + '<div class="scroller settings-wrapper settings-panel">'
        + '<div class="tab-bar TOP">' + '<div class="tab-bar-item ce-tab" id="ce-settings-tab" onclick="CustomEmotes.prototype.changeTab(\'ce-settings-tab\');">Custom Emotes</div>' + '<div class="tab-bar-item ce-tab" id="ce-emotes-tab" onclick="CustomEmotes.prototype.changeTab(\'ce-emotes-tab\');">Emotes</div>' + '<div class="tab-bar-item ce-tab" id="ce-updates-tab" onclick="CustomEmotes.prototype.changeTab(\'ce-updates-tab\');">Updates</div></div>'
        + '<div class="ce-settings">'
        + '<div class="ce-pane control-group" id="ce-settings-pane" style="display: none;">' + '<ul class="checkbox-group">';

    for (var aSetting in CustomEmotes.settingsArray) {
        var setting = CustomEmotes.settingsArray[aSetting];
        var id = setting["id"];
        if (setting["implemented"]) {
            settingsInner += '<li>' + '<div class="checkbox" onclick="CustomEmotes.updateSettings(this);">' + '<div class="checkbox-inner">' + '<input type="checkbox" id="' + id + '" ' + (CustomEmotes.settings[id] ? "checked" : "") + '>' + '<span></span>' + '</div>' + '<span>' + aSetting + ' - ' + setting["info"] + '</span>' + '</div>' + '</li>';
        }
    }

    settingsInner += '</ul>' + '</div>'
        + '<div class="ce-pane control-group" id="ce-emotes-pane" style="display: none;">';
    settingsInner += '<form name="emoteForm" action="" method="get" style="width: 100%;">';
    settingsInner += '<span style="font-size: 1.0em;">Emote List URL</span><br>'
        + '<div style="display: inline-block; border: 1px solid black; position: relative; width: 100%;">'
        + '<input type="text" name="emoteURLText" value="https://" style="width: 90%;">'
        + '<input type="button" value="Add" onclick="CustomEmotes.AddList(this.form)" style="position: absolute; right: 0; height: 100%; border: none; width: 10%">';
    settingsInner += '</div></form><br><span style="font-size: 1.0em;">Emote Lists</span>';
    settingsInner += '<table class="ce-emote-table"><thead><tr><th width="25px"></th><th width="25%">Name</th><th>URL</th><th width="50px">Toggle</th></tr></thead><tbody id="custom-emote-table">';
    for (name in CustomEmotes.emoteLinks) {
        $.ajax({
            url: CustomEmotes.emoteLinks[name],
            dataType: 'json',
            async: false,
            success: function(list) {
                if (list.name && list.emotes) {
                    CustomEmotes.emoteLists[list.name.replace(/\s+/, "") ] = list.emotes;

                    settingsInner += '<tr id="'
                        + list.name.replace(/\s+/, "")  + '-TableList"><td><input type="button" title="Remove" value="X" onclick="CustomEmotes.removeList(\''
                        + list.name.replace(/\s+/, "")  + '\')"></td><td>'
                        + list.name + '</td><td><input type="text" class="disabled-text" value="'
                        + CustomEmotes.emoteLinks[name] + '" disabled></td><td><input type="checkbox" id="'
                        + list.name.replace(/\s+/, "")  + '" '
                        + (CustomEmotes.emoteToggle[list.name.replace(/\s+/, "")] ? "checked" : "") + ' onclick="CustomEmotes.updateEmoteList(this);"></td></tr>';
                }
            }
        });
    }
    settingsInner += '</tbody></table></div>';
    settingsInner += '<div class="ce-pane control-group" id="ce-updates-pane" style="display: none;">' + '<span>Current Version: ' + CustomEmotes.prototype.getVersion() + '</span>';

    if (CustomEmotes.prototype.getVersion() == CustomEmotes.updateLog[0].version)
        settingsInner += '<span style="float: right;">Up To Date</span>';
    else
        settingsInner += '<span style="float: right;"><a href="https://raw.githubusercontent.com/Natsulus/Custom-Emotes/gh-pages/plugin/CustomEmotes.js" download>Update to Version ' + CustomEmotes.updateLog[0].version + '</a></span>';

    settingsInner += '<div class="update-log" style="height: 325px;">';
    for (var i = 0; i < CustomEmotes.updateLog.length; i++) {
        settingsInner += '<div class="update-title">' + CustomEmotes.updateLog[i].version + ' - ' + CustomEmotes.updateLog[i].type +'</div>';
        settingsInner += '<div class="update-list">';
        for (var j = 0; j < CustomEmotes.updateLog[i].data.length; j++) {
            settingsInner += '<li>' + CustomEmotes.updateLog[i].data[j] + '</li>';
        }
        settingsInner += '</div>';
    }
    settingsInner += '</div></div></div></div></div>';

    function showSettings() {
        $(".tab-bar-item").removeClass("selected");
        CustomEmotes.settingsButton.addClass("selected");
        $(".form .settings-right .settings-inner").hide();

        CustomEmotes.settingsPanel.show();

        if (CustomEmotes.settingsLastTab == null) {
            CustomEmotes.prototype.changeTab("ce-settings-tab");
        } else {
            CustomEmotes.prototype.changeTab(CustomEmotes.settingsLastTab);
        }
    }

    CustomEmotes.settingsButton = $("<div/>", {
        class: "tab-bar-item",
        text: "Custom Emotes",
        id: "ce-settings-new",
        click: function(event) {
            event.stopImmediatePropagation();
            showSettings();
        }
    });

    CustomEmotes.settingsPanel.html(settingsInner);

    function defer() {
        var $btnSettings = $(".btn.btn-settings");
        if ($btnSettings.length < 1) {
            setTimeout(defer, 100);
        } else {
            $btnSettings.first().on("click", function() {

                function innerDefer() {
                    if ($(".modal-inner").first().is(":visible")) {

                        CustomEmotes.settingsPanel.hide();
                        var tabBar = $(".tab-bar.SIDE").first();

                        $(".tab-bar.SIDE .tab-bar-item:not(#bd-settings-new)").click(function() {
                            $(".form .settings-right .settings-inner").first().show();
                            $("#ce-settings-new").removeClass("selected");
                            CustomEmotes.settingsPanel.hide();
                        });
                        var tabBarSet = setInterval(function() {
                            var bdtab = $("#bd-settings-new");
                            if (bdtab.length > 0) {
                                clearInterval(tabBarSet);
                                tabBar.append(CustomEmotes.settingsButton);
                                $("#ce-settings-new").removeClass("selected");
                                bdtab.click(function() {
                                    $("#ce-settings-new").removeClass("selected");
                                    CustomEmotes.settingsPanel.hide();
                                });
                            }
                        }, 50);

                        $(".form .settings-right .settings-inner").last().after(CustomEmotes.settingsPanel);
                        $("#ce-settings-new").removeClass("selected");
                    } else {
                        setTimeout(innerDefer, 100);
                    }
                }

                innerDefer();
            });
        }
    }

    defer();
};

Array.prototype.extend = function(other_array) {
    other_array.forEach(function(v) {
        this.push(v)
    }, this);
};

CustomEmotes.settingsArray = {
    "Enable Emotes": {
        "id": "enable-emotes",
        "info": "Show Custom Emotes",
        "default": true,
        "implemented": true
    },
    "Enable Tooltips": {
        "id": "enable-tooltips",
        "info": "Show Emote Names on Hover",
        "default": true,
        "implemented": true
    }
};

CustomEmotes.prototype.saveSettings = function() {
    localStorage.setItem("customEmotesSettings", JSON.stringify(CustomEmotes.settings));
};

CustomEmotes.prototype.getDefaultSettings = function() {
    var defaultSettings = {};
    for (var setting in CustomEmotes.settingsArray) {
        defaultSettings[CustomEmotes.settingsArray[setting]["id"]] = CustomEmotes.settingsArray[setting]["default"];
    }
    return defaultSettings;
};

CustomEmotes.preloadImages = function() {
    if (!CustomEmotes.preloadImages.list || CustomEmotes.preloadImages.list.length !== 0) {
        CustomEmotes.preloadImages.list = [];
    }

    for (var emote in CustomEmotes.emoteLists) {
        var img = new Image();
        img.onload = function() {
            var index = CustomEmotes.preloadImages.list.indexOf(this);
            if (index !== -1) {
                CustomEmotes.preloadImages.list.splice(index, 1);
                console.log("[Custom Emotes] Emotes Preloaded");
            }
        };
        CustomEmotes.preloadImages.list.push(img);
        img.src = CustomEmotes.emoteLists[emote].url;
    }
    console.log("[Custom Emotes] Preloading " + CustomEmotes.preloadImages.list.length + " emotes(s)");
};

CustomEmotes.removeList = function (name) {
    if (CustomEmotes.emoteLists[name]) {
        delete CustomEmotes.emoteLists[name];
        delete CustomEmotes.emoteLinks[name];
        delete CustomEmotes.emoteToggle[name];
        $("#" + name + "-TableList").remove();
        localStorage.setItem("customEmoteToggles", JSON.stringify(CustomEmotes.emoteToggle));
        localStorage.setItem("customEmoteLists", JSON.stringify(CustomEmotes.emoteLinks));
    }
};

CustomEmotes.loadList = function (url) {
    $.getJSON(url, function (list) {
        if (list.name && list.emotes) {
            CustomEmotes.emoteLists[list.name.replace(/\s+/, "") ] = list.emotes;
            CustomEmotes.emoteLinks[list.name.replace(/\s+/, "") ] = url;
            CustomEmotes.emoteToggle[list.name.replace(/\s+/, "") ] = false;

            var str = '<tr id="'
                + list.name.replace(/\s+/, "")  + '-TableList"><td><input type="button" title="Remove" value="X" onclick="CustomEmotes.removeList(\''
                + list.name.replace(/\s+/, "")  + '\')"></td><td>'
                + list.name + '</td><td><input type="text" class="disabled-text" value="'
                + url + '" disabled></td><td><input type="checkbox" id="'
                + list.name.replace(/\s+/, "")  + '" onclick="CustomEmotes.updateEmoteList(this);"></td></tr>';
            var row = $.parseHTML(str);
            $("#custom-emote-table").append(row);
            localStorage.setItem("customEmoteLists", JSON.stringify(CustomEmotes.emoteLinks));
        }
    });
};

CustomEmotes.getUpdateLog = function() {
    $.ajax({
        url: "https://natsulus.github.io/Custom-Emotes/plugin/updates.json",
        dataType: 'json',
        async: false,
        success: function (log) {
            CustomEmotes.updateLog = log;
        }
    });
};

CustomEmotes.prototype.load = function() {
    CustomEmotes.settings = JSON.parse(localStorage.getItem("customEmotesSettings")) || CustomEmotes.prototype.getDefaultSettings();
    CustomEmotes.prototype.saveSettings();
    CustomEmotes.emoteLinks = JSON.parse(localStorage.getItem("customEmoteLists")) || {};
    CustomEmotes.emoteToggle = JSON.parse(localStorage.getItem("customEmoteToggles")) || {};

    CustomEmotes.getUpdateLog();
    CustomEmotes.isReady = true;

    $('head').append(
        '<style id="ce-css">'
        + '.disabled-text {cursor: text !important; -webkit-user-select: initial !important;}'
        + '.update-title {font-size: 1.5em; margin-top: 0.67em; margin-bottom: 0.67em; margin-left: 0; margin-right: 0;}'
        + '.update-list {list-style-type: disc}'
        + '.update-log {background: white url(https://natsulus.github.io/Custom-Emotes/plugin/bg-panel.png) repeat-x bottom left; border: 1px solid #3C769D; color: #333333; padding: 11px; margin: 10px 0; overflow-y: auto; }'
        + '.emotewrapper {display: inline-block; position: relative;}'
        + '.ce-emote-sprite {animation: play 1s steps(1) infinite;}' + '@keyframes play {from{background-position: 0 0;} to {background-position: 0 100%;}}'
        + '.ce-emote-table {text-align: center; width: 520px; white-space: nowrap; margin: 0 auto;}'
        + '.ce-emote-table thead th {background: #EBEBEB!important; text-align: center;}'
        + '.ce-emote-table tbody td, .ce-emote-table thead th {color: #87909c!important; padding: 5px!important;}'
        + '.ce-emote-table tbody tr {background: #F7F7F7!important;}'
        + '.ce-emote-table tbody td {text-align: center; font-size: small;}'
        + '.emote-tooltip{display: inline-block; position: relative;}'
        + '.emote-tooltip:hover:after{background: rgba(31,31,31,0.6); border: 1px solid rgba(142,142,142,0.6); border-radius: 5px; top: -24px; color: #fff; content: attr(tooltip); left: -20px; padding: 3px 10px; position: absolute; z-index: 98; white-space: nowrap;}'
        + '</style>'
    );
};

CustomEmotes.prototype.unload = function() {
    //
};

CustomEmotes.prototype.start = function() {
    setInterval(CustomEmotes.getUpdateLog, 1000 * 60 * 60);
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var startTry = setInterval(function() {
        if (CustomEmotes.isReady) clearInterval(startTry);
        else return;

        CustomEmotes.observer = new MutationObserver(function() {
            CustomEmotes.processChat();
        });

        var chatRetry = setInterval(function() {
            $(".chat").each(function() {
                clearInterval(chatRetry);
                if (CustomEmotes.settings["enable-emotes"]) {
                    CustomEmotes.observer.observe(this, {childList: true, characterData: true, attributes: false, subtree: true});
                    CustomEmotes.processChat();
                }
            });
        }, 100);
        CustomEmotes.createSettings();
        console.log("[Custom Emotes] Started");
    }, 100);
};

CustomEmotes.parseEmotes = function (node) {
    var returnArr = [];
    if (node.length > 0) {
        var html = node.nodeValue;
        var match = false;
        $.each(CustomEmotes.emoteLists, function (name, list) {
            if (CustomEmotes.emoteToggle[name]) {
                $.each(list, function (key, emote) {
                    if (match) return;
                    var index = html.lastIndexOf(key);
                    if (index !== -1) {
                        match = true;
                        returnArr.extend(CustomEmotes.parseEmotes(document.createTextNode(html.slice(0, index))));

                        var emoteNode = document.createElement("div");
                        emoteNode.className = "emotewrapper";
                        emoteNode.setAttribute("tooltip", key);
                        if (CustomEmotes.settings["enable-tooltips"]) emoteNode.className += " emote-tooltip";
                        emoteNode.style.cssText = "top: " + Math.ceil((emote.size - 8) / 2.5) + "px";
                        var emoteImage;
                        if (emote.type == "image") {
                            emoteImage = document.createElement("div");
                            emoteImage.className = "ce-emote";
                            emoteImage.style.width = emote.size + "px";
                            emoteImage.style.height = emote.size + "px";
                            emoteImage.style.backgroundImage = "url('" + emote.url + "')";
                            emoteImage.style.backgroundSize = emote.size + "px auto";
                        } else if (emote.type == "animation") {
                            emoteImage = document.createElement("div");
                            emoteImage.className = "ce-emote ce-emote-sprite";
                            emoteImage.style.width = emote.size + "px";
                            emoteImage.style.height = emote.size + "px";
                            emoteImage.style.animationTimingFunction = "steps(" + (emote.steps - 1) + ")";
                            emoteImage.style.animationDuration = (emote.steps * CustomEmotes.animationSpeed) + "s";
                            emoteImage.style.backgroundImage = "url('" + emote.url + "')";
                            emoteImage.style.backgroundSize = emote.size + "px auto";
                        }
                        emoteNode.appendChild(emoteImage);
                        returnArr.push(emoteNode);

                        returnArr.extend(CustomEmotes.parseEmotes(document.createTextNode(html.slice(index + key.length))));
                    }
                });
            }
        });
    }
    if (returnArr.length > 0) return returnArr;
    return [node];
};

CustomEmotes.processChat = function() {
    $(".message-content>span:not(.ce-emotes-scanned),.comment .markup>span:not(.ce-emotes-scanned)").each(function() {
        $(this).contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            var rarr = CustomEmotes.parseEmotes(this);
            for (var i = 0; i < rarr.length; i++) {
                this.parentNode.insertBefore(rarr[i], this);
            }
            if (rarr.length > 1) this.remove();
        })

    }).addClass("ce-emotes-scanned");
};

CustomEmotes.prototype.stop = function () {
    CustomEmotes.observer.disconnect();
    $(".emotewrapper").replaceWith(function() {
        return $(this).attr("tooltip");
    });
    $(".ce-emotes-scanned").removeClass("ce-emotes-scanned");
    CustomEmotes.settingsButton.hide();
    console.log("[Custom Emotes] Stopped");
};

CustomEmotes.prototype.update = function () {
    console.log("[Custom Emotes] Updated");
};

CustomEmotes.prototype.getName = function () {
    return "Custom Emotes";
};

CustomEmotes.prototype.getDescription = function () {
    return "Add as many custom emotes as you want!";
};

CustomEmotes.prototype.getVersion = function () {
    return "1.0.1";
};

CustomEmotes.prototype.getAuthor = function () {
    return "Natsulus";
};
