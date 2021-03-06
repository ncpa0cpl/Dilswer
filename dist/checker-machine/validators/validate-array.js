"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArray = void 0;
const type_def_helpers_1 = require("../../type-def-helpers");
const validation_error_1 = require("../validation-error/validation-error");
const validate_one_of_1 = require("./validate-one-of");
const validateArray = (path, type, data) => {
    if (!Array.isArray(data))
        throw new validation_error_1.ValidationError(path, type, data);
    for (const [index, elem] of data.entries()) {
        (0, validate_one_of_1.validateOneOf)(`${path}.${index}`, type_def_helpers_1.DataType.OneOf(...type.arrayOf), elem);
    }
};
exports.validateArray = validateArray;
