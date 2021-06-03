(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/GameManagaer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '016acPX4gdMY7UAGkEsBhhU', 'GameManagaer', __filename);
// Scripts/GameManagaer.js

"use strict";

var GAME_CONFIG = {
    ROW: 4,
    COL: 4,
    MARGIN: 16 //results from: (this.mainGame.width - this.block.width * GAME_CONFIG.ROW) / 5;
};

var ARR_BLOCK = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

var DIRECTION = cc.Enum({
    RIGHT: -1,
    LEFT: -1,
    UP: -1,
    DOWN: -1
});

var MIN_LENGTH = 10;

cc.Class({
    extends: cc.Component,

    properties: {
        mainGame: cc.Node,
        block: cc.Prefab,
        score: cc.Label,
        recored: cc.Label,
        winGame: cc.Node,
        loseGame: cc.Node,
        _isChange: false
    },

    onLoad: function onLoad() {
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.initObj();
        this.eventHandler();
    },
    initObj: function initObj() {
        this.loseGame.active = false;
        this.winGame.active = false;
        this._showWinLose = false;
        this.score.string = 0;
        this.initBlock();
        this.addNum();
        this.addNum();
    },
    initBlock: function initBlock() {
        this.mainGame.removeAllChildren();
        var y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN,
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                this.newBlock = cc.instantiate(this.block);
                this.newBlock.setParent(this.mainGame);
                this.newBlock.setPosition(cc.v2(x, y));
                x += this.newBlock.width + GAME_CONFIG.MARGIN;
                if (ARR_BLOCK[row][col] != 0) {
                    var label = this.newBlock.getChildByName("Value");
                    label.getComponent(cc.Label).string = ARR_BLOCK[row][col];
                    this.newBlock.getComponent("BlockController").setColor();
                }
            }
            y -= this.newBlock.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },
    onKeyDown: function onKeyDown(event) {
        this._isChange = false;
        switch (event.keyCode) {
            case 37:
            case 39:
                this.checkLeftRight(event.keyCode);
                break;
            case 38:
            case 40:
                this.checkUpDown(event.keyCode);
        }
    },
    eventHandler: function eventHandler() {
        var _this = this;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        if (cc.sys.isMobile) {
            this.mainGame.on("touchstart", function (event) {
                _this._startPoint = event.getLocation();
            });
            this.mainGame.on("touchend", function (event) {
                _this._endPoint = event.getLocation();
                _this.reflectTouch();
            });
            this.mainGame.on("touchcancel", function (event) {
                _this._endPoint = event.getLocation();
                _this.reflectTouch();
            });
        }
        if (cc.sys.IPAD || cc.sys.DESKTOP_BROWSER) {
            this.mainGame.on("mousedown", function (event) {
                _this._isCLick = false;
                _this._startPoint = event.getLocation();
                _this._firstX = _this._startPoint.x;
                _this._firstY = _this._startPoint.y;
            });
            this.mainGame.on("mouseup", function (event) {
                _this._isCLick = true;
                _this._endPoint = event.getLocation();
                _this._endX = _this._startPoint.x - _this._endPoint.x;
                _this._endY = _this._startPoint.y - _this._endPoint.y;
                _this._vector = cc.v2(_this._endX, _this._endY);
                _this.mouseEvent();
            });
        }
    },
    reflectTouch: function reflectTouch() {
        var startVec = this._startPoint;
        var endVec = this._endPoint;
        var pointsVec = endVec.sub(startVec);
        var vecLength = pointsVec.mag();
        if (vecLength > MIN_LENGTH) {
            if (Math.abs(pointsVec.x) > Math.abs(pointsVec.y)) {
                if (pointsVec.x > 0) this.touchEvent(DIRECTION.RIGHT);else this.touchEvent(DIRECTION.LEFT);
            } else {
                if (pointsVec.y > 0) this.touchEvent(DIRECTION.UP);else this.touchEvent(DIRECTION.DOWN);
            }
        }
    },
    touchEvent: function touchEvent(direction) {
        switch (direction) {
            case DIRECTION.RIGHT:
            case DIRECTION.LEFT:
                this.checkLeftRight(direction);
                break;
            case DIRECTION.UP:
            case DIRECTION.DOWN:
                this.checkUpDown(direction);
                break;

        }
    },
    mouseEvent: function mouseEvent() {
        if (this._vector.mag() > MIN_LENGTH) {
            if (this._canMove) {
                this._canMove = false;
                if (this._vector.x < 0 && this._vector.y < 50 && this._vector.y > -50) {
                    this.blockMoveRight();
                } else if (this._vector.x > 0 && this._vector.y < 50 && this._vector.y > -50) {
                    this.blockMoveLeft();
                } else if (this._vector.y < 0 && this._vector.x < 50 && this._vector.x > -50) {
                    this.blockMoveUp();
                } else if (this._vector.y > 0 && this._vector.x < 50 && this._vector.x > -50) {
                    this.blockMoveDown();
                }
            }
        }
    },
    slideLeftOrUp: function slideLeftOrUp(array) {
        var newArray = [];
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            if (array[row] != 0) newArray.push(array[row]);
        };
        for (var col = newArray.length; col < GAME_CONFIG.COL; col++) {
            newArray.push(0);
        }
        return newArray;
    },
    slideRightOrDown: function slideRightOrDown(array) {
        var newArray = [];
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            if (array[row] == 0) newArray.push(array[row]);
        };
        for (var _row = 0; _row < GAME_CONFIG.ROW; _row++) {
            if (array[_row] != 0) newArray.push(array[_row]);
        };
        return newArray;
    },
    addNum: function addNum() {
        this.updateScore();
        var newArr = [];
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (ARR_BLOCK[row][col] == 0) {
                    newArr.push({ x: row, y: col });
                }
            }
        }
        if (newArr.length > 0) {
            var randomXY = newArr[Math.random() * newArr.length >> 0];
            var number = Math.floor(Math.random() * 4);
            number < 3 ? ARR_BLOCK[randomXY.x][randomXY.y] = 2 : ARR_BLOCK[randomXY.x][randomXY.y] = 4;
        }
        this.initBlock();
    },
    hasChangeArray: function hasChangeArray(arr1, arr2) {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            if (arr1[row] != arr2[row]) {
                this._isChange = true;
            }
        }
    },
    checkLose: function checkLose() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                var block = ARR_BLOCK[row][col];
                if (block === 0) return false;
                if (col > 0 && ARR_BLOCK[row][col - 1] == block) return false;
                if (col < GAME_CONFIG.ROW - 1 && ARR_BLOCK[row][col + 1] == block) return false;
                if (row > 0 && ARR_BLOCK[row - 1][col] == block) return false;
                if (row < GAME_CONFIG.ROW - 1 && ARR_BLOCK[row + 1][col] == block) return false;
            }
        }
        return true;
    },
    checkWin: function checkWin() {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (ARR_BLOCK[row][col] === 2048) {
                    this.winGame.active = true;
                    return;
                }
            }
        }
    },
    updateScore: function updateScore() {
        var total = 0;
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                if (ARR_BLOCK[row][col] > 2) {
                    total += ARR_BLOCK[row][col];
                    this.score.string = total;
                }
            }
        }
    },
    clickRestart: function clickRestart() {
        ARR_BLOCK = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this.initObj();
    },
    checkLeftRight: function checkLeftRight(value) {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            var arr = ARR_BLOCK[row];
            if (value === 37 || value === 1) {
                ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
                for (var col = 0; col < GAME_CONFIG.COL - 1; col++) {
                    if (ARR_BLOCK[row][col] == ARR_BLOCK[row][col + 1]) {
                        ARR_BLOCK[row][col] += ARR_BLOCK[row][col + 1];
                        ARR_BLOCK[row][col + 1] = 0;
                    }
                }
                ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
            }
            if (value === 39 || value === 0) {
                ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
                for (var _col = 3; _col > 0; _col--) {
                    if (ARR_BLOCK[row][_col] == ARR_BLOCK[row][_col - 1]) {
                        ARR_BLOCK[row][_col] += ARR_BLOCK[row][_col - 1];
                        ARR_BLOCK[row][_col - 1] = 0;
                    }
                }
                ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
            }
            this.hasChangeArray(arr, ARR_BLOCK[row]);
        }
        if (this._isChange) {
            this.addNum();
        }
    },
    checkUpDown: function checkUpDown(value) {
        for (var row = 0; row < GAME_CONFIG.ROW; row++) {
            var newArr = [];
            for (var col = 0; col < GAME_CONFIG.COL; col++) {
                newArr.push(ARR_BLOCK[col][row]);
            }
            var arr = newArr;
            if (value === 38 || value === 2) {
                newArr = this.slideLeftOrUp(newArr);
                for (var m = 0; m < 3; m++) {
                    if (newArr[m] == newArr[m + 1]) {
                        newArr[m] += newArr[m + 1];
                        newArr[m + 1] = 0;
                    }
                }
                newArr = this.slideLeftOrUp(newArr);
            }
            if (value === 40 || value === 3) {
                newArr = this.slideRightOrDown(newArr);
                for (var _m = 3; _m > 0; _m--) {
                    if (newArr[_m] == newArr[_m - 1]) {
                        newArr[_m] += newArr[_m - 1];
                        newArr[_m - 1] = 0;
                    }
                }
                newArr = this.slideRightOrDown(newArr);
            }
            for (var i = 0; i < 4; i++) {
                ARR_BLOCK[i][row] = newArr[i];
            }
            this.hasChangeArray(arr, newArr);
        }
        if (this._isChange) {
            this.addNum();
        }
    },
    update: function update() {
        this.checkWin();
        if (this.checkLose()) {
            this.loseGame.active = true;
        };
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameManagaer.js.map
        