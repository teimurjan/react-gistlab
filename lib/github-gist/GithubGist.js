"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var React = require("react");
var utils_1 = require("../utils");
var GIST_BASE_URL = 'https://gist.github.com';
var GIST_REGEX = /^https:\/\/gist\.github\.com\/(.*)\/([0-9a-z]*)/;
var counter = new utils_1.Counter();
exports.getGistInfoFromURL = function (url) {
    var match = url.match(GIST_REGEX);
    if (!match || match.length < 3) {
        throw new Error("Invalid gist url: " + url);
    }
    var _ = match[0], username = match[1], gistID = match[2];
    var filename = exports.getFileName(url);
    return { username: username, gistID: gistID, filename: filename };
};
exports.getFileName = function (url) {
    var fileAnchor = url.split('#').pop();
    if (fileAnchor && fileAnchor.match(/file-/) !== null) {
        return "" + fileAnchor.replace('file-', '').replace('-', '.');
    }
    return undefined;
};
exports.getScriptID = function (info) { return "gist_script_" + exports.getUniqueID(info); };
exports.getCallbackName = function (info) {
    return "gist_callback_" + exports.getUniqueID(info);
};
exports.getUniqueID = function (_a) {
    var gistID = _a.gistID, filename = _a.filename;
    return counter.next() + "_" + gistID + (filename ? "__" + filename.replace(/[^0-9A-z]/g, '') : '');
};
exports.getQueryParams = function (filename, callbackName) { return (filename ? ["file=" + filename] : []).concat([
    "callback=" + callbackName
]); };
exports.getGistURL = function (info, queryParams) {
    return GIST_BASE_URL + "/" + info.username + "/" + info.gistID + ".json?" + queryParams.join('&');
};
exports.addScriptToDocument = function (src, id) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.id = id;
    document.head.appendChild(script);
};
exports.isStylesheetAdded = function (stylesheetHref) {
    return !!document.querySelector("head link[href=\"" + stylesheetHref + "\"]");
};
exports.addStylesheetToDocument = function (href) {
    var stylesheet = document.createElement('link');
    stylesheet.type = 'text/css';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.appendChild(stylesheet);
};
exports.isURLFilenameInvalidCase = function (filenameFromURL, actualFilename) {
    return actualFilename.toLowerCase() === filenameFromURL &&
        actualFilename !== filenameFromURL;
};
exports.getGistData = function (info) {
    return new Promise(function (resolve) {
        var scriptID = exports.getScriptID(info);
        var callbackName = exports.getCallbackName(info);
        window[callbackName] = function (data) {
            var script = document.getElementById(scriptID);
            if (script) {
                script.remove();
            }
            resolve(data);
            window[callbackName] = undefined;
        };
        var queryParams = exports.getQueryParams(info.filename, callbackName);
        var url = exports.getGistURL(info, queryParams);
        exports.addScriptToDocument(url, scriptID);
    });
};
exports.getWholeGistData = function (info) {
    return exports.getGistData(__assign({}, info, { filename: undefined }));
};
exports.getGistFileData = function (info) { return exports.getGistData(info); };
var GithubGist = (function (_super) {
    __extends(GithubGist, _super);
    function GithubGist(props) {
        var _this = _super.call(this, props) || this;
        _this.updateFilenameCaseIfNeeded = function (gistFiles) {
            var info = _this.state.info;
            gistFiles.forEach(function (filename) {
                if (info.filename && exports.isURLFilenameInvalidCase(info.filename, filename)) {
                    _this.setState({
                        info: __assign({}, info, { filename: filename })
                    });
                }
            });
        };
        _this.state = {
            isLoading: true,
            data: undefined,
            info: exports.getGistInfoFromURL(props.url)
        };
        if (!utils_1.isDocumentDefined() || !utils_1.isWindowDefined()) {
            utils_1.warnNoWindowOrDocument();
            return _this;
        }
        _this.init();
        return _this;
    }
    GithubGist.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, filenameFromURL, gistData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        info = this.state.info;
                        filenameFromURL = info.filename;
                        return [4, exports.getWholeGistData(info)];
                    case 1:
                        gistData = _a.sent();
                        if (filenameFromURL) {
                            this.updateFilenameCaseIfNeeded(gistData.files);
                            this.fetchGistFile();
                        }
                        else {
                            this.setData(gistData);
                        }
                        return [2];
                }
            });
        });
    };
    GithubGist.prototype.componentWillUnmount = function () {
        if (!utils_1.isDocumentDefined() || !utils_1.isWindowDefined()) {
            utils_1.warnNoWindowOrDocument();
            return;
        }
        this.destroy();
    };
    GithubGist.prototype.destroy = function () {
        var data = this.state.data;
        if (data) {
            var stylesheet = document.querySelector("head link[href=\"" + data.stylesheet + "\"]");
            if (stylesheet) {
                stylesheet.remove();
            }
        }
    };
    GithubGist.prototype.fetchGistFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, gistFileData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        info = this.state.info;
                        return [4, exports.getGistFileData(info)];
                    case 1:
                        gistFileData = _a.sent();
                        this.setData(gistFileData);
                        return [2];
                }
            });
        });
    };
    GithubGist.prototype.setData = function (data) {
        this.setState({
            isLoading: false,
            data: data
        });
        if (!exports.isStylesheetAdded(data.stylesheet)) {
            exports.addStylesheetToDocument(data.stylesheet);
        }
    };
    GithubGist.prototype.render = function () {
        var _a = this.state, isLoading = _a.isLoading, data = _a.data;
        var Loading = this.props.Loading;
        if (isLoading) {
            return Loading ? React.createElement(Loading, null) : null;
        }
        if (data) {
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: data.div } });
        }
    };
    return GithubGist;
}(React.PureComponent));
exports.default = GithubGist;
//# sourceMappingURL=GithubGist.js.map