/*
	getReact
	A jQuery plugin to get React Data for elements in Discord
	Written by Natsulus
	Licensed under the MIT License
*/

(function($) {
	$.fn.getReactData = function() {
		const arr = [];

		this.each((i, el) => {
			arr.push(el[Object.keys(el).find(key => {
				return key.startsWith("__reactInternalInstance");
			})]);
		});

		return arr;
	};

	$.fn.getReactInstance = function() {
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
})(window.jQuery);