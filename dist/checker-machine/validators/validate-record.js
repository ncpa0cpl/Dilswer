"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecord = void 0;
var validation_error_1 = require("../validation-error/validation-error");
var validate_type_1 = require("./validate-type");
var validateRecord = function (path, type, data) {
    var e_1, _a;
    if (typeof data !== "object" || data === null)
        throw new validation_error_1.ValidationError(path, type, data);
    try {
        for (var _b = __values(Object.entries(type.recordOf)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), key = _d[0], fieldDescriptor = _d[1];
            if (!(key in data)) {
                if (fieldDescriptor.required === true ||
                    fieldDescriptor.required === undefined) {
                    throw new validation_error_1.ValidationError(path, type, data);
                }
                else {
                    continue;
                }
            }
            // @ts-expect-error
            var value = data[key];
            (0, validate_type_1.validateType)("".concat(path, ".").concat(key), fieldDescriptor.type, value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.validateRecord = validateRecord;
