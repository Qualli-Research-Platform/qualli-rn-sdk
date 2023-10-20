"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var API_BASE_PATH = 'https://4d6b-2a02-1810-c27-3800-75d5-ccc9-aaf6-a94a.ngrok-free.app/api/';
var ApiRequest_1 = require("./ApiRequest");
var logger_1 = require("./../helpers/logger");
var ApiManager = {
    identify: function (apiKey, userKey) { return __awaiter(void 0, void 0, void 0, function () {
        var url, jsonResponse, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(API_BASE_PATH, "app-user/identify");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, ApiRequest_1.default)({
                            apiKey: apiKey,
                            url: url,
                            method: 'POST',
                            body: {},
                            headers: userKey ? { user_key: userKey } : {},
                        })];
                case 2:
                    jsonResponse = _a.sent();
                    if (jsonResponse.success) {
                        (0, logger_1.default)('QUALLI: identify ', jsonResponse);
                        return [2 /*return*/, jsonResponse];
                    }
                    console.error('QUALLI: Failed to identify user');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('QUALLI: Failed to identify user: ', error_1);
                    return [2 /*return*/, { success: false }];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    setUserAttributes: function (apiKey, userSessionKey, attributes) { return __awaiter(void 0, void 0, void 0, function () {
        var url, headers, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (Object.keys(attributes).length === 0) {
                        (0, logger_1.default)('QUALLI: No attributes to send');
                        return [2 /*return*/];
                    }
                    url = "".concat(API_BASE_PATH, "app-user/set-attributes");
                    if (!userSessionKey) {
                        console.error('QUALLI: No session ID available');
                        return [2 /*return*/];
                    }
                    headers = { 'user-session-key': userSessionKey };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, ApiRequest_1.default)({
                            apiKey: apiKey,
                            url: url,
                            method: 'POST',
                            headers: headers,
                            body: { attributes: attributes, timestamp: new Date() },
                        })];
                case 2:
                    _a.sent();
                    (0, logger_1.default)('QUALLI: Successfully set user attributes');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('QUALLI: Error setting user attributes: ', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    performTrigger: function (apiKey, userSessionKey, trigger) { return __awaiter(void 0, void 0, void 0, function () {
        var url, headers, jsonResponse, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(trigger === null || trigger === void 0 ? void 0 : trigger.name)) {
                        (0, logger_1.default)('QUALLI: Invalid trigger');
                        return [2 /*return*/];
                    }
                    url = "".concat(API_BASE_PATH, "app-user-events/trigger");
                    if (!userSessionKey) {
                        console.error('QUALLI: No session ID available');
                        return [2 /*return*/];
                    }
                    headers = { 'user-session-key': userSessionKey };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, ApiRequest_1.default)({
                            apiKey: apiKey,
                            url: url,
                            method: 'POST',
                            headers: headers,
                            body: { trigger: trigger, timestamp: new Date() },
                        })];
                case 2:
                    jsonResponse = _a.sent();
                    if (jsonResponse.success) {
                        (0, logger_1.default)('QUALLI: Successfully performed trigger');
                        return [2 /*return*/, jsonResponse];
                    }
                    console.error('QUALLI: Error performing trigger');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('QUALLI: Error performing trigger: ', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    logSurveyAction: function (apiKey, userSessionKey, uniqueId, action, data) { return __awaiter(void 0, void 0, void 0, function () {
        var url, headers, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(API_BASE_PATH, "surveys/").concat(uniqueId, "/action");
                    if (!userSessionKey) {
                        console.error('QUALLI: No session ID available');
                        return [2 /*return*/];
                    }
                    headers = { 'user-session-key': userSessionKey };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, ApiRequest_1.default)({
                            apiKey: apiKey,
                            url: url,
                            method: 'POST',
                            headers: headers,
                            body: { action: action, data: data, timestamp: new Date() },
                        })];
                case 2:
                    _a.sent();
                    (0, logger_1.default)('QUALLI: Successfully logged the survey action');
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    (0, logger_1.default)(error_4.response);
                    console.error('QUALLI: Error logging the survey action: ', error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    logEvent: function (apiKey, userSessionKey, action) { return __awaiter(void 0, void 0, void 0, function () {
        var url, headers, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(API_BASE_PATH, "app-user-events/store");
                    if (!userSessionKey) {
                        console.error('QUALLI: No session ID available');
                        return [2 /*return*/];
                    }
                    headers = { 'user-session-key': userSessionKey };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, ApiRequest_1.default)({
                            apiKey: apiKey,
                            url: url,
                            method: 'POST',
                            headers: headers,
                            body: { action: action, event_name: action, timestamp: new Date() },
                        })];
                case 2:
                    _a.sent();
                    (0, logger_1.default)('QUALLI: Successfully logged the action');
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    (0, logger_1.default)(error_5.response);
                    console.error('QUALLI: Error logging the action: ', error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
exports.default = ApiManager;
