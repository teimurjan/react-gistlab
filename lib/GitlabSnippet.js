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
var GITLAB_SNIPPETS_BASE_URL = 'https://gitlab.com/snippets';
var DEFAULT_CORS_PROXY_URL = 'https://cors.io/?';
var GITLAB_SNIPPET_URL_REGEX = /^https:\/\/gitlab\.com\/snippets\/([0-9a-z]*)/;
var GITLAB_SNIPPET_REGEX = /document\.write\(\'(.*)\'\)/;
var getInfo = function (url) {
    var match = url.match(GITLAB_SNIPPET_URL_REGEX);
    if (!match || match.length < 2) {
        throw new Error("Invalid snippet url: " + url);
    }
    var _ = match[0], snippetID = match[1];
    return { snippetID: snippetID };
};
var getSnippetHTML = function (responseText) {
    var lines = responseText.split('\n');
    if (lines.length < 3) {
        return {
            css: '',
            html: ''
        };
    }
    var _a = lines.map(function (line) {
        var match = line.match(GITLAB_SNIPPET_REGEX);
        if (!match || match.length < 2) {
            return '';
        }
        return match[1];
    }), css = _a[0], html = _a[1];
    var cssHrefMatch = css.match(/href=\\"(.*)\\"/);
    var cssHref = cssHrefMatch && cssHrefMatch.length > 1 ? cssHrefMatch[1] : '';
    return {
        css: cssHref,
        html: unescapeHTML(html)
    };
};
var unescapeHTML = function (html) {
    return html
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '')
        .replace(/\\\//g, '/');
};
var GitlabSnippet = (function (_super) {
    __extends(GitlabSnippet, _super);
    function GitlabSnippet(props) {
        var _this = _super.call(this, props) || this;
        _this.getSnippet = function () {
            var info = _this.state.info;
            var corsProxyURL = _this.props.corsProxyURL;
            var url = "" + corsProxyURL + GITLAB_SNIPPETS_BASE_URL + "/" + info.snippetID + ".js";
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.send();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    var _a = getSnippetHTML(request.responseText), css = _a.css, html = _a.html;
                    _this.addSnippetToDOM(css, html);
                }
            };
        };
        _this.addSnippetToDOM = function (css, html) {
            var info = _this.state.info;
            var htmlID = "gitlab-snippet-style-" + info.snippetID;
            var isStylesheetAdded = !!document.getElementById(htmlID);
            if (!isStylesheetAdded) {
                var link = document.createElement('link');
                link.href = css;
                link.id = htmlID;
                link.type = 'text/css';
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
            _this.setState({ data: html, isLoading: false });
        };
        _this.state = {
            isLoading: true,
            data: undefined,
            info: getInfo(props.url)
        };
        return _this;
    }
    GitlabSnippet.prototype.componentDidMount = function () {
        this.getSnippet();
    };
    GitlabSnippet.prototype.componentWillUnmount = function () {
        var _a = this.state, data = _a.data, info = _a.info;
        if (data) {
            var stylesheet = document.getElementById("gitlab-snippet-style-" + info.snippetID);
            if (stylesheet) {
                stylesheet.remove();
            }
        }
    };
    GitlabSnippet.prototype.render = function () {
        var _a = this.state, isLoading = _a.isLoading, data = _a.data;
        var Loading = this.props.Loading;
        if (isLoading) {
            return Loading ? React.createElement(Loading, null) : null;
        }
        if (data) {
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: data } });
        }
        return null;
    };
    GitlabSnippet.defaultProps = {
        corsProxyURL: DEFAULT_CORS_PROXY_URL
    };
    return GitlabSnippet;
}(React.PureComponent));
exports.default = GitlabSnippet;
//# sourceMappingURL=GitlabSnippet.js.map