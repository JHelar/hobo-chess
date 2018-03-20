/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: mousePressed, setup, draw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mousePressed\", function() { return mousePressed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setup\", function() { return setup; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"draw\", function() { return draw; });\nconst CANVAS_HEIGHT = 480;\r\nconst CANVAS_WIDTH = 640;\r\nconst CELL_WIDTH = CANVAS_WIDTH / 3;\r\nconst CELL_HEIGHT = CANVAS_HEIGHT / 3;\r\nconst BOARD_SIZE = 3;\r\nconst FONT_SIZE = 16 * 5;\r\n\r\nlet BOARD = [];\r\nlet CURRENT_PLAYER = 'X';\r\nlet NEED_REDRAW = true;\r\n\r\nconst newRow = rowIndex => {\r\n    const row = [];\r\n    for(let cell = 0; cell < BOARD_SIZE; cell++){\r\n        row.push(createCell(rowIndex, cell));\r\n    }    \r\n    return row;\r\n}\r\nconst createCell = (rowIndex, columnIndex) => ({ value: '', color: '#fff', textColor: '#000', x: rowIndex * CELL_WIDTH, y: columnIndex * CELL_HEIGHT });\r\n\r\nconst newBoard = () => {\r\n    const board = [];\r\n    for(let row = 0; row < BOARD_SIZE; row++){\r\n        board.push(newRow(row));\r\n    }\r\n    return board;\r\n}\r\n/*Game logic*/\r\nconst getClosestSquare = (mouseX, mouseY) => {\r\n    return {\r\n        x: (mouseX / CELL_WIDTH) | 0,\r\n        y: (mouseY / CELL_HEIGHT) | 0\r\n    }\r\n}\r\n\r\nconst checkGameState = board => {\r\n    const getColumns = board => board.map(row => row);\r\n}\r\n\r\nfunction mousePressed(){\r\n    const { x, y } = getClosestSquare(mouseX, mouseY);\r\n    const cell = BOARD[x][y];\r\n    cell.value = CURRENT_PLAYER;\r\n    CURRENT_PLAYER = CURRENT_PLAYER === 'X' ? 'O' : 'X';\r\n\r\n    NEED_REDRAW = true;\r\n    return false;\r\n}\r\n\r\nfunction setup(){\r\n    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);\r\n    BOARD = newBoard();\r\n}\r\n\r\nfunction draw(){\r\n    if(NEED_REDRAW){\r\n        // Draw board\r\n        BOARD.forEach((row, rowIndex) => {\r\n            row.forEach((cell, columnIndex) => {\r\n                textSize(FONT_SIZE);\r\n                textAlign(CENTER, CENTER);\r\n\r\n                fill(cell.color)\r\n                rect(cell.x, cell.y, CELL_WIDTH, CELL_HEIGHT);\r\n                fill(cell.textColor)\r\n                text(cell.value, cell.x + (CELL_WIDTH / 2), cell.y + (CELL_HEIGHT / 2));\r\n            })\r\n        })\r\n        NEED_REDRAW = false;\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\r\n\r\nwindow.setup = _game__WEBPACK_IMPORTED_MODULE_0__[\"setup\"];\r\nwindow.draw = _game__WEBPACK_IMPORTED_MODULE_0__[\"draw\"];\r\nwindow.mousePressed = _game__WEBPACK_IMPORTED_MODULE_0__[\"mousePressed\"];\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });