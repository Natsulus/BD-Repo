//META{"name":"MoveChangelog"}*//

class MoveChangelog {
    start() {
        //
    }

    stop() {
        //
    }

    // Meta Data //

    getName() {
        return "Move Changelog";
    }

    getDescription() {
        return "Move Changelog!";
    }

    getVersion() {
        return "1.0.0";
    }

    getAuthor() {
        return `<a href="https://github.com/Natsulus/BD-Repo" target="_BLANK">Natsulus</a>`;
    }

    load() {
        // Deprecated in v2, just use constructor
    }
}

(() => {
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

            window.BdApi.injectCSS("changelog-css", css);
            clearInterval(injectInterval);
        }
    }, 100);

    const changelogObs = new MutationObserver(mutations => {
        mutations.forEach(ev => {
            if (ev.addedNodes.length !== 1) return;

            if (ev.addedNodes[0].className && ev.addedNodes[0].className.includes("modal")) {
                if (ev.addedNodes[0].childNodes[0].childNodes[0].className.includes("user-settings-modal")) {
                    $(".settings-actions .btn-confirm").after($(".change-log-button").detach());
                    $(".change-log-button-container").remove();
                }
            } else if (ev.addedNodes[0].id === "bd-pane") {
                $(".bda-name:contains(Move Changelog)").parents("li").remove();
            }
        });
    });

    changelogObs.observe(document.body, {
        childList: true,
        subtree: true
    });
})(); // use IIFE to avoid polluting global namespace