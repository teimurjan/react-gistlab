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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var GIST_BASE_URL = 'https://gist.github.com';
var GIST_REGEX = /^https:\/\/gist\.github\.com\/(.*)\/([0-9a-z]*)/;
var getInfo = function (url) {
    var match = url.match(GIST_REGEX);
    if (!match || match.length < 3) {
        throw new Error("Invalid gist url: " + url);
    }
    var _ = match[0], username = match[1], gistID = match[2];
    var filename = getFileName(url);
    return { username: username, gistID: gistID, filename: filename };
};
var getFileName = function (url) {
    var fileAnchor = url.split('#').pop();
    if (fileAnchor && fileAnchor.match(/file-/) !== null) {
        return "" + fileAnchor.replace('file-', '').replace('-', '.');
    }
    return undefined;
};
var getCallbackName = function (_a) {
    var gistID = _a.gistID, filename = _a.filename;
    return "gist_callback_" + gistID + (filename ? "__" + filename : '');
};
var GithubGist = (function (_super) {
    __extends(GithubGist, _super);
    function GithubGist(props) {
        var _this = _super.call(this, props) || this;
        _this.initCallback = function () {
            var info = _this.state.info;
            window[getCallbackName(info)] = function (data) {
                _this.setState({
                    isLoading: false,
                    data: data
                });
                var isStylesheetAdded = document.querySelectorAll("head link[href=\"" + data.stylesheet + "\"]")
                    .length === 0;
                if (isStylesheetAdded) {
                    var stylesheet = document.createElement('link');
                    stylesheet.type = 'text/css';
                    stylesheet.rel = 'stylesheet';
                    stylesheet.href = data.stylesheet;
                    document.head.appendChild(stylesheet);
                }
            };
        };
        _this.addScriptTag = function () {
            var script = document.createElement('script');
            var info = _this.state.info;
            var queryParams = (info.filename ? ["file=" + info.filename] : []).concat([
                "callback=" + getCallbackName(info)
            ]);
            var url = GIST_BASE_URL + "/" + info.username + "/" + info.gistID + ".json?" + queryParams.join('&');
            script.type = 'text/javascript';
            script.src = url;
            script.id = "gist_script_" + info.gistID;
            document.head.appendChild(script);
        };
        _this.state = {
            isLoading: true,
            data: undefined,
            info: getInfo(props.url)
        };
        _this.initCallback();
        return _this;
    }
    GithubGist.prototype.componentDidMount = function () {
        this.addScriptTag();
    };
    GithubGist.prototype.componentWillUnmount = function () {
        var _a = this.state, data = _a.data, info = _a.info;
        if (data) {
            var stylesheet = document.querySelector("head link[href=\"" + data.stylesheet + "\"]");
            if (stylesheet) {
                stylesheet.remove();
            }
        }
        var script = document.getElementById("gist_script_" + info.gistID);
        if (script) {
            script.remove();
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