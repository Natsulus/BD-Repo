//META{"name":"CustomEmotes"}*//

function CustomEmotes() {
	
	///////////////////////////
	// Meta Data
	
	this.getName = function() {
		return "Custom Emotes";
	};
	
	this.getDescription = function() {
		return "See the emotes YOU want to see.@Natsulus on the #plugin channel of the BetterDiscord Server for Support";
	};
	
	this.getVersion = function() {
		return "2.0.0";
	};
	
	this.getAuthor = function() {
		return "Natsulus";
	};
	
	///////////////////////////
	// Main
	
	this.start = function() {
		console.log("[Custom Emotes] Enabling Plugin");
		// create & append Custom Emotes settings tab
		// get settings from localStorage or default settings
	};
	
	this.stop = function() {
		console.log("[Custom Emotes] Disabling Plugin");
	};
	
	this.observer = function(e) {
		// console.log(e);
	};
	
	///////////////////////////
	// Core
	
	this.defaultSettings = {
		"Custom Emotes": {
			//
		},
		"Emote Menu": {
			//
		},
		"Show Names": {
			//
		},
		"Show Modifier": {
			//
		},
		"Emote Updater": {
			//
		},
		"Auto Update": {
			//
		}
	};
	
	///////////////////////////
	// Unused
	
	this.onMessage = function() {
		// Not available till v2, may use depending on how it works
	};
	
	this.onSwitch = function() {
		// Not sure why I'd use this
	};
	
	this.getSettingsPanel = function() {
		// Using Custom Settings Panel
		// Will attempt to make it open Custom Settings Panel instead.
	};
	
	this.load = function() {
		// Pointless, just use start
	};
	
	this.unload = function() {
		// When does this even occur? lmao
	};
}

/*
BdApi.joinServer("code"); // Use to join my server.
BdApi.injectCSS("id", "css"); // Use this to inject css instead
BdApi.clearCSS("id"); // Use this to clear CSS with the identifier id
BdApi.getPlugin("name"); // Interact with other plugins
BdApi.getIPC(); // Currently useless.
BdApi.getCore(); // Get BD Core Module
BdApi.getUserIdByName("name"); // Exactly what it says
BdApi.getUserNameById("id"); // Exactly what it says

var blah = require('fs'); // Pure Node.js Modules are usable

setInterval(blah, 1000); // Timers are throttled by at least 1000ms when minimised

Examples:
https://i.jiiks.net/0MTI1M.js
https://gist.github.com/megamit/a676acb2f34b201e364858aca299fb44
https://gist.github.com/megamit/29757d819de5356595271cebb577f6a8
https://gist.github.com/kosshishub/cc96972eff5d1ee3feca98b7f3fd586b

*/