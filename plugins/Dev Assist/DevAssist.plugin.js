//META{"name":"DevAssist"}*//

class DAEvent {
    constructor(name) {
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }
}

class DAEventSystem {
    constructor() {
        this.events = {};
    }

    registerEvent(eventName) {
        this.events[eventName] = new DAEvent(eventName);
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

class UtilityMethods {
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
        //return this.utils.getReactProps($(".account-details")[0]).user;
    }

    static getCreationTimestamp(id) {
        return (id / 4194304) + 1420070400000;
    }
}

class DevAssist {
    //
}