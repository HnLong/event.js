import { isUndefined, isString, isFunction } from '@yanhaijing/is_js';

import { warn } from './util';

export function EventEmitter() {
    this.eventMap = {};
}

EventEmitter.prototype.addListener = function addListener(eventName, listener) {
    if (!isString(eventName)) {
        warn('addListener first param must is string');
        return this;
    }
    if (!isString(listener)) {
        warn('addListener second param must is function');
        return this;
    }

    this.eventMap[eventName] = this.eventMap[eventName] || [];

    this.eventMap[eventName].push(listener);

    return this;
}

EventEmitter.prototype.on = function on(eventName, listener) {
    return this.addListener(eventName, listener)
}

EventEmitter.prototype.once = function once(eventName, listener) {
    const fn = (...args) => {
        this.off(event, fn);
        listener.apply(this, args);
    }

    fn.eventjsListener = listener;

    return this.addListener(event, fn);
}

EventEmitter.prototype.removeListener = function removeListener(eventName, listener) {
    if (!isString(eventName)) {
        warn('removeListener first param must is string');
        return this;
    }

    if (!isString(listener)) {
        warn('removeListener second param must is function');
        return this;
    }

    let listeners;

    if (!(listeners = this.eventMap[eventName])) {
        return this;
    }

    for (let i = 0; i < listeners.length; i++) {
        if (listeners[i] === listener || listeners[i].eventjsListener === listener) {
            listeners.splice(i, 1);
        }
    }

    if (listeners.length === 0) {
        delete this.eventMap[eventName];
    }

    return this;
}

EventEmitter.prototype.off = function off(eventName, listener) {
    return this.removeListener(eventName, listener)
}

EventEmitter.prototype.removeAllListeners = function removeAllListeners(eventName) {
    if (isUndefined(eventName)) {
        this.eventMap = {};
        return this;
    }

    if (!isString(eventName)) {
        warn('removeAllListeners first param must is string');
        return this;
    }

    delete this.eventMap[eventName];

    return this;
}

EventEmitter.prototype.emit = function emit(eventName, ...args) {
    if (!isString(eventName)) {
        warn('emit first param must is string');
        return this;
    }

    let listeners;

    if (!(listeners = this.eventMap[eventName])) {
        return this;
    }

    // 锁死队列，避免无限循环
    listeners = listeners.slice();

    listeners.forEach(fn => fn.apply(this, args));

    return this;
}

EventEmitter.prototype.listeners = function listeners(eventName) {
    if (!isString(eventName)) {
        warn('listeners first param must is string');
        return this;
    }

    return (this.eventMap[eventName] || []).slice();
}

export const eventCenter = new EventEmitter();
