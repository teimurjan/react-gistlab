"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocumentDefined = function () { return typeof document !== 'undefined'; };
exports.isWindowDefined = function () { return typeof window !== 'undefined'; };
exports.warnNoWindowOrDocument = function () {
    console.warn("WARNING:\n    window or document is undefined.\n    It may cause unexpected behavior.\n    ");
};
//# sourceMappingURL=utils.js.map