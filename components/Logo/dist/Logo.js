"use strict";
exports.__esModule = true;
exports.Logo = void 0;
var react_1 = require("react");
var image_1 = require("next/image");
var Logo_module_scss_1 = require("./Logo.module.scss");
var link_1 = require("next/link");
exports.Logo = react_1["default"].forwardRef(function (_a) {
    var image = _a.image, _b = _a.href, href = _b === void 0 ? '/' : _b, style = _a.style;
    return (react_1["default"].createElement(link_1["default"], { href: href },
        react_1["default"].createElement("a", { className: Logo_module_scss_1["default"].container, style: style },
            react_1["default"].createElement(image_1["default"], { src: image, width: 38, height: 52, alt: 'logo' }))));
});
