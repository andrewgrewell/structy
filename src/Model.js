import isObject from 'lodash.isObject';
import isArray from 'lodash.isArray';
import forEach from 'lodash.forEach';
import reduce from 'lodash.reduce';
import every from 'lodash.every';
import merge from 'lodash.merge';
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
    constructor(data, fieldConfig) {
        Object.defineProperty(this, 'fieldConfig', { value: fieldConfig || {} });
        Object.defineProperty(this, 'size', { value: Object.keys(data || {}).length });
        Object.defineProperty(this, 'props', { value: {} });
        this._initializeModel(data);
    }

    static mergeFieldConfigs(...configs) {
        return merge({}, ...configs);
    }

    _initializeModel(data, object = this) {
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
                if (wrappedValue) {
                    _set(this.props, path + key, wrappedValue);
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
            object.props[key] = value;
            Object.defineProperty(object, key, {
                value: this._checkWrapValue(value, this._getFieldConfigForKey(key)),
                enumerable: true
            });
        });
    }

    _getFieldConfigForKey(key) {
        if (isArray(key) || key.includes('.')) {
            return _get(this.fieldConfig, key) || this.fieldConfig['*'];
        }
        return this.fieldConfig[key] || this.fieldConfig['*'];
    }

    _checkWrapValue(value, wrap) {
        if (!wrap) {
            return value;
        }
        else if (typeof wrap === 'function' && value != null) {
            return new wrap(value); // eslint-disable-line new-cap
        }
        // property config
        else if (isObject(wrap)) {
            if (wrap.constructor && (value != null || !wrap.nullable)) {
                return new wrap.constructor(value || wrap.default);
            }
            else if (wrap.default) {
                return wrap.default;
            }
            else {
                // nested property configs
                return reduce(wrap, (result, nestedValue, key) => {
                    result[key] = this._checkWrapValue(nestedValue);
                    return result;
                }, {});
            }
        }
        return value;
    }

    // ACCESSORS

    get(field) {
        return this[field];
    }

    getIn(path) {
        return _get(this, path);
    }

    set(field, value) {
        if (this.props[field] === value) {
            return this;
        }
        return new Model({ ...this, [field]: this._checkWrapValue(value, this._getFieldConfigForKey(field)) });
    }

    setIn(path, value) {
        if (this.getIn(path) === value) {
            return this;
        }
        return new Model(
            _set(
                { ...this },
                path,
                this._checkWrapValue(value, this._getFieldConfigForKey(path))
            )
        );
    }

    assign(data) {
        if (every(data, (value, key) => value === this.props[key])) {
            return this;
        }
        return new Model(this._enumerateData(data, {...this}));
    }

    remove(field) {
        if (!field) {
            return this;
        }
        const newModel = { ...this };
        delete newModel[field];
        return new Model(newModel);
    }
}