"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocumentDefined = function () { return typeof document !== 'undefined'; };
exports.isWindowDefined = function () { return typeof window !== 'undefined'; };
exports.warnNoWindowOrDocument = function () {
    console.warn("WARNING:\n    window or document is undefined.\n    It may cause unexpected behavior.\n    ");
};
var Counter = (function () {
    function Counter() {
        this.value = 0;
    }
    Counter.prototype.next = function () {
        this.value += 1;
        return this.value;
    };
    return Counter;
}());
exports.Counter = Counter;
//# sourceMappingURL=utils.js.map