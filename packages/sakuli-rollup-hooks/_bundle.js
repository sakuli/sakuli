define("test-2", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.pi = 3.4;
});
define("test", ["require", "exports", "test-2"], function (require, exports, test_2_1) {
    "use strict";
    exports.__esModule = true;
    console.log(test_2_1.pi);
});
