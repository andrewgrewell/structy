import isObject from 'lodash.isobject';
import forEach from 'lodash.foreach';
import reduce from 'lodash.reduce';
import every from 'lodash.every';
import merge from 'lodash.merge';
import _assign from 'lodash.assign';
import _set from 'lodash.set';
import _get from 'lodash.get';

const CONFIG_KEYWORDS = ['default', 'nullable', 'constructor'];
/**
 * Base immutable model class
 *
 * @param data {object} - object to convert to immutable Model
 * @param config {object} - { [field]: constructor|config }
 */
export default class Model {
    constructor(data, fieldConfig, filter) {
        if (filter) {
            data = filter(data);
        }
        Object.defineProperties(this, {
            fieldConfig: { value: fieldConfig || {} },
            size: { value: Object.keys(data || {}).length }
        });
        this._initializeModel(data);
    }

    static mergeFieldConfigs(...configs) {
        return merge({}, ...configs);
    }

    _initializeModel(data) {
        this._enumerateData(data);
        this._parseConfig(this.fieldConfig);
    }

    _parseConfig(config, path = '') {
        // go through the config object and set any values (that are not set) that have defaults / aren't nullable
        forEach(config, (wrap, key) => {
            if (CONFIG_KEYWORDS.indexOf(key) !== -1) {
                return;
            }
            let existingValue = this.getIn(path + key);
            if (typeof existingValue === 'object') {
                this._parseConfig(wrap, `${key}.`);
            }
            else if (!existingValue) {
                let wrappedValue = this._checkWrapValue(null, wrap);
                if (wrappedValue != null) {
                    if (path.length) {
                        // keeping with the precedent of only making first level props read only
                        // anything nested should be its own data structure
                        _set(this, path + key, wrappedValue);
                    }
                    else {
                        Object.defineProperty(this, key, {
                            value: wrappedValue,
                            enumerable: true
                        });
                    }
                }
            }
        });
    }

    _enumerateData(data, object = this) {
        forEach(data, (value, key) => {
            Object.defineProperty(object, key, {
                value: this._checkWrapValue(value, this._getFieldConfigForKey(key)),
                enumerable: true
            });
        });
    }

    _getFieldConfigForKey(key) {
        key = '' + key;
        if (Array.isArray(key) || key.includes('.')) {
            return _get(this.fieldConfig, key) || this.fieldConfig['*'];
        }
        return this.fieldConfig[key] || this.fieldConfig['*'];
    }

    _checkWrapValue(value, wrap) {
        if (wrap == null) {
            return value;
        }
        else if (typeof wrap === 'function') {
            return value != null ? new wrap(value) : null; // eslint-disable-line new-cap
        }
        // property config
        else if (isObject(wrap)) {
            if (wrap.hasOwnProperty('constructor') && (value != null || wrap.nullable != null || wrap.default != null)) {
                if (value || wrap.default || wrap.nullable === false) {
                    return new wrap.constructor(value || this._applyDefaultValue(wrap.default));
                }
            }
            else if (wrap.default != null) {
                return this._applyDefaultValue(value || wrap.default);
            }
            else {
                // nested property configs
                return reduce(wrap, (result, nestedValue, key) => {
                    result[key] = this._checkWrapValue(value, nestedValue);
                    return result;
                }, {});
            }
        }
        return value;
    }

    _applyDefaultValue(defaultValue) {
        if (typeof defaultValue === 'function') {
            return defaultValue(this);
        }
        return defaultValue;
    }

    // ACCESSORS

    get(field) {
        return this[field];
    }

    getIn(path) {
        return _get(this, path);
    }

    set(field, value) {
        if (this[field] === value) {
            return this;
        }
        return new this.constructor({ ...this, [field]: this._checkWrapValue(value, this._getFieldConfigForKey(field)) });
    }

    setIn(path, value) {
        if (this.getIn(path) === value) {
            return this;
        }
        return new this.constructor(
            _set(
                { ...this },
                path,
                this._checkWrapValue(value, this._getFieldConfigForKey(path))
            )
        );
    }

    assign(data) {
        if (every(data, (value, key) => value === this[key])) {
            return this;
        }
        return new this.constructor(_assign({ ...this }, data));
    }

    remove(field) {
        if (!field) {
            return this;
        }
        const newModel = { ...this };
        delete newModel[field];
        return new this.constructor(newModel);
    }
}