"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var camelCase = function (str) { return str.toLowerCase().replace(/(\_\w)/g, function (c) { return c[1].toUpperCase(); }); };
var addThrowlhosToObject = function (object) {
    var _loop_1 = function (httpStatus, httpCode) {
        if (!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1', '2'].includes(String(httpCode).charAt(0))) {
            object['err_' + camelCase(httpStatus)] = function (message, errors) {
                return {
                    code: httpCode,
                    status: httpStatus,
                    message: message !== null && message !== void 0 ? message : http_status_codes_1.default.getStatusText(String(httpCode)),
                    errors: errors,
                };
            };
        }
    };
    for (var _i = 0, _a = Object.entries(http_status_codes_1.default); _i < _a.length; _i++) {
        var _b = _a[_i], httpStatus = _b[0], httpCode = _b[1];
        _loop_1(httpStatus, httpCode);
    }
    object['err_custom'] = function (message, code, errors) {
        return {
            message: message,
            code: code,
            status: 'CUSTOM_ERROR',
            errors: errors,
        };
    };
};
var throwlhos = {
    middleware: function (request, response, next) {
        addThrowlhosToObject(response);
        next();
    }
};
addThrowlhosToObject(throwlhos);
exports.default = throwlhos;
