/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BulletPath.ts":
/*!***************************!*\
  !*** ./src/BulletPath.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.BulletPath = void 0;\nclass BulletPath {\n    constructor(x, y, pathfunc, color, radius) {\n        this.activebullets = []; //bullet times\n        this.x = x;\n        this.y = y;\n        this.pathFunction = pathfunc;\n        this.color = color;\n        this.radius = radius;\n    }\n    draw(ctx) {\n        ctx.fillStyle = this.color;\n        for (let i = 0; i < this.activebullets.length; i++) {\n            let bullet = this.pathFunction(this.activebullets[i]);\n            ctx.beginPath();\n            ctx.arc(this.x + bullet.x, this.y + bullet.y, this.radius, 0, 2 * Math.PI);\n            ctx.fill();\n        }\n    }\n    update() {\n        for (let i = 0; i < this.activebullets.length; i++) {\n            this.activebullets[i]++;\n            if (this.activebullets[i] > 100) {\n                this.activebullets.splice(i, 1);\n                i--;\n            }\n        }\n    }\n    fire() {\n        this.activebullets.push(0);\n    }\n}\nexports.BulletPath = BulletPath;\n\n\n//# sourceURL=webpack://touhoumath/./src/BulletPath.ts?");

/***/ }),

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nconst Player_1 = __webpack_require__(/*! ./Player */ \"./src/Player.ts\");\nclass Game {\n    constructor() {\n        this.entities = [];\n        this.canvas = document.getElementById(\"canvas\");\n        this.ctx = this.canvas.getContext(\"2d\");\n        this.player = new Player_1.Player();\n        this.entities.push(this.player);\n        Game.instance = this;\n    }\n    update() {\n        for (let i = 0; i < this.entities.length; i++) {\n            this.entities[i].update();\n        }\n    }\n    draw() {\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n        for (let i = 0; i < this.entities.length; i++) {\n            this.entities[i].draw(this.ctx);\n        }\n    }\n    loop() {\n        this.update();\n        this.draw();\n        requestAnimationFrame(() => this.loop());\n    }\n    spawn(entity) {\n        this.entities.push(entity);\n    }\n}\nexports.Game = Game;\n\n\n//# sourceURL=webpack://touhoumath/./src/Game.ts?");

/***/ }),

/***/ "./src/Input.ts":
/*!**********************!*\
  !*** ./src/Input.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Input = void 0;\nclass Input {\n    constructor() {\n        this.up = false;\n        this.down = false;\n        this.left = false;\n        this.right = false;\n        this.fire = false;\n        Input.instance = this;\n        document.onkeydown = (e) => this.keyDown(e);\n        document.onkeyup = (e) => this.keyUp(e);\n    }\n    keyDown(e) {\n        switch (e.key) {\n            case \"w\":\n                this.up = true;\n                break;\n            case \"s\":\n                this.down = true;\n                break;\n            case \"a\":\n                this.left = true;\n                break;\n            case \"d\":\n                this.right = true;\n                break;\n            case \" \":\n                this.fire = true;\n                break;\n        }\n    }\n    keyUp(e) {\n        switch (e.key) {\n            case \"w\":\n                this.up = false;\n                break;\n            case \"s\":\n                this.down = false;\n                break;\n            case \"a\":\n                this.left = false;\n                break;\n            case \"d\":\n                this.right = false;\n                break;\n            case \" \":\n                this.fire = false;\n                break;\n        }\n    }\n}\nexports.Input = Input;\n(() => {\n    new Input();\n})();\n\n\n//# sourceURL=webpack://touhoumath/./src/Input.ts?");

/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Player = void 0;\nconst BulletPath_1 = __webpack_require__(/*! ./BulletPath */ \"./src/BulletPath.ts\");\nconst Input_1 = __webpack_require__(/*! ./Input */ \"./src/Input.ts\");\nconst _1 = __webpack_require__(/*! . */ \"./src/index.ts\");\nconst Game_1 = __webpack_require__(/*! ./Game */ \"./src/Game.ts\");\nclass Player {\n    constructor() {\n        this.cooldown = 0;\n        this.x = 0;\n        this.y = 0;\n        this.width = 50;\n        this.height = 50;\n        this.color = \"red\";\n        this.speed = 5;\n    }\n    draw(ctx) {\n        ctx.fillStyle = this.color;\n        ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n    update() {\n        if (Input_1.Input.instance.up) {\n            this.y -= this.speed;\n        }\n        if (Input_1.Input.instance.down) {\n            this.y += this.speed;\n        }\n        if (Input_1.Input.instance.left) {\n            this.x -= this.speed;\n        }\n        if (Input_1.Input.instance.right) {\n            this.x += this.speed;\n        }\n        if (Input_1.Input.instance.fire) {\n            this.fire();\n        }\n        this.cooldown--;\n    }\n    fire() {\n        if (this.cooldown > 0) {\n            return;\n        }\n        this.cooldown = 10;\n        //shoot straight forward\n        let bullet = new BulletPath_1.BulletPath(this.x, this.y, _1.presetPaths.sin(this.x, this.y, 4), \"black\", 5);\n        Game_1.Game.instance.spawn(bullet);\n        bullet.fire();\n    }\n}\nexports.Player = Player;\n\n\n//# sourceURL=webpack://touhoumath/./src/Player.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.presetPaths = void 0;\nconst Game_1 = __webpack_require__(/*! ./Game */ \"./src/Game.ts\");\nexports.presetPaths = {\n    straight: (x, y, speed) => {\n        return (t) => ({ x: t * speed, y: 0 });\n    },\n    sin: (x, y, speed) => {\n        return (t) => ({ x: t * speed, y: Math.sin(t * speed * Math.PI / 180) * 50 });\n    },\n    cos: (x, y, speed) => {\n        return (t) => ({ x: t * speed, y: Math.cos(t * speed * Math.PI / 180) * 50 });\n    },\n};\nlet game = new Game_1.Game();\ngame.loop();\n\n\n//# sourceURL=webpack://touhoumath/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;