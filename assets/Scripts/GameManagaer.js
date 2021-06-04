
const GAME_CONFIG = {
    ROW: 4,
    COL: 4,
    MARGIN: 16 //results from: (this.mainGame.width - this.block.width * GAME_CONFIG.ROW) / 5;
};

let ARR_BLOCK = [
    [0, 0, 0, 0], [0, 0, 0, 0],
    [0, 0, 0, 0], [0, 0, 0, 0],
];

const DIRECTION = cc.Enum({
    RIGHT: -1,
    LEFT: -1,
    UP: -1,
    DOWN: -1
});

const MIN_LENGTH = 10;

cc.Class({
    extends: cc.Component,

    properties: {
        mainGame: cc.Node,
        block: cc.Prefab,
        score: cc.Label,
        record: cc.Label,
        winGame: cc.Node,
        loseGame: cc.Node,
        _isChange: false,
        _restart: false,
        _score: 0
    },

    onLoad() {
        this.initObj();
        this.eventHandler();
        this.getScoreStorge();
        this.score.string = 0; 
    },

    initObj() {
        this.loseGame.active = false;
        this.winGame.active = false;
        this.addNum();
        this.addNum();
        this._restart = false;
    },

    initBlock() {
        this.mainGame.removeAllChildren();
        let y = this.mainGame.height / 2 - GAME_CONFIG.MARGIN,
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                this.newBlock = cc.instantiate(this.block); 
                this.newBlock.setParent(this.mainGame);
                this.newBlock.setPosition(cc.v2(x, y));
                x += this.newBlock.width + GAME_CONFIG.MARGIN;
                if(ARR_BLOCK[row][col] != 0) {
                    let label = this.newBlock.getChildByName("Value");
                    label.getComponent(cc.Label).string = ARR_BLOCK[row][col];
                    this.newBlock.getComponent("BlockController").setColor();
                }
            }
            y -= this.newBlock.height + GAME_CONFIG.MARGIN;
            x = this.mainGame.width / -2 + GAME_CONFIG.MARGIN;
        };
    },

    onKeyDown(event) {
        if(this._isCLick){
            this._isChange = false;
            switch(event.keyCode) {
                case 37:
                case 39:
                    this.checkLeftRight(event.keyCode);  
                    break;
                case 38: 
                case 40:
                    this.checkUpDown(event.keyCode);
            }
        }
    },

    eventHandler() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        if (cc.sys.IPAD || cc.sys.isMobile) {
            this.mainGame.on("touchstart", (event) => {
                this._startPoint = event.getLocation();
            })
            this.mainGame.on("touchend", (event) => {
                this._endPoint = event.getLocation();
                this.reflectTouch();
            })
            this.mainGame.on("touchcancel", (event) => {
                this._endPoint = event.getLocation();
                this.reflectTouch();
            })
        }
        if (cc.sys.DESKTOP_BROWSER) {
            this.mainGame.on("mousedown", (event) => {
                this._isCLick = false;
                this._startPoint = event.getLocation();
                this._firstX = this._startPoint.x;
                this._firstY = this._startPoint.y;
            })
            this.mainGame.on("mouseup", (event) => {
                this._isCLick = true;
                this._endPoint = event.getLocation();
                this._endX = this._startPoint.x - this._endPoint.x;
                this._endY = this._startPoint.y - this._endPoint.y;
                this._vector = cc.v2(this._endX, this._endY);
                this.reflectCLick();
            })
        }
    },

    reflectTouch() {
        let pointsVec = this._endPoint.sub(this._startPoint);
        let vecLength = pointsVec.mag();
        if (vecLength > MIN_LENGTH) {
            if (Math.abs(pointsVec.x) > Math.abs(pointsVec.y)) {
                if (pointsVec.x > 0) this.touchEvent(DIRECTION.RIGHT);
                else this.touchEvent(DIRECTION.LEFT);
            } else {
                if (pointsVec.y > 0) this.touchEvent(DIRECTION.UP);
                else this.touchEvent(DIRECTION.DOWN);
            }
        }
    },

    reflectCLick() {
        let pointsVec = this._endPoint.sub(this._startPoint);
        let vecLength = pointsVec.mag();
        if (vecLength > MIN_LENGTH) {
            if (Math.abs(pointsVec.x) > Math.abs(pointsVec.y)) {
                if (pointsVec.x > 0) this.mouseEvent(DIRECTION.RIGHT);
                else this.mouseEvent(DIRECTION.LEFT);
            } else {
                if (pointsVec.y > 0) this.mouseEvent(DIRECTION.UP);
                else this.mouseEvent(DIRECTION.DOWN);
            }
        }
    },

    touchEvent(direction) {
        if(this._restart) return;
        this._restart = false;
        switch (direction) {
            case DIRECTION.RIGHT: 
            case DIRECTION.LEFT:
                this.checkLeftRight(direction);
                break;
            case DIRECTION.UP: 
            case DIRECTION.DOWN: 
                this.checkUpDown(direction)
                break;
            
        }
    },
 
    mouseEvent(direction) {
        if(this._restart) return;
        this._restart = false;
        switch (direction) {
            case DIRECTION.RIGHT: 
            case DIRECTION.LEFT:
                this.checkLeftRight(direction);
                break;
            case DIRECTION.UP: 
            case DIRECTION.DOWN: 
                this.checkUpDown(direction)
                break;
            
        }
    },

    slideLeftOrUp(array) {
        let newArray = [];
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(array[row] != 0) newArray.push(array[row]);
        };
        for(let col = newArray.length; col < GAME_CONFIG.COL; col++){
            newArray.push(0);
        }
        return newArray;
    },

    slideRightOrDown(array) {
        let newArray = [];
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(array[row] == 0) newArray.push(array[row]);
        };
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(array[row] != 0) newArray.push(array[row]);
        };
        return newArray;
    },

    addNum() {
        this.updateScore();
        let newArr = [];
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col = 0; col < GAME_CONFIG.COL; col++) { 
                if(ARR_BLOCK[row][col] == 0) {
                    newArr.push({x: row, y: col});
                }
            }
        }
        if(newArr.length > 0) {
            let randomXY = newArr[Math.random() * newArr.length >> 0];
            let number = Math.floor(Math.random() * 4);
            if(number < 3) {
                ARR_BLOCK[randomXY.x][randomXY.y] = 2;
            }
            else {
                ARR_BLOCK[randomXY.x][randomXY.y] = 4;
            } 
        }
        this.initBlock();
    },

    hasChangeArray(arr1, arr2) {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            if(arr1[row] != arr2[row]) {
                this._isChange = true;
            }
        }
    },

    checkLose() {
        for (let row = 0; row < GAME_CONFIG.ROW; row++) {
            for (let col = 0; col < GAME_CONFIG.COL; col++) {
                let block = ARR_BLOCK[row][col];
                if (block === 0) return false;
                if (col > 0 && ARR_BLOCK[row][col - 1] == block) return false;
                if (col < GAME_CONFIG.ROW - 1 && ARR_BLOCK[row][col + 1] == block) return false;
                if (row > 0 && ARR_BLOCK[row - 1][col] == block) return false;
                if (row < GAME_CONFIG.ROW - 1 && ARR_BLOCK[row + 1][col] == block) return false;
            }
        }
        return true;
    }, 

    checkWin() {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            for(let col =0; col < GAME_CONFIG.COL; col++) {
                if(ARR_BLOCK[row][col] === 2048) {
                    this.winGame.active = true;
                    this.checkScore();
                    return;
                }
            }
        }
    },

    updateScore(value) {
        this.score.string = this._score;
    },

    clickRestart() {
        this._restart = true;
        this._score = 0;
        ARR_BLOCK = [[0,0,0,0], [0,0,0,0],
                     [0,0,0,0], [0,0,0,0]];
        this.initObj();
    },

    checkLeftRight(value) {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            let arr = ARR_BLOCK[row];
            if(value === 37 || value === 1) {
                ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
                for(let col = 0; col < GAME_CONFIG.COL - 1; col++) {
                    if(ARR_BLOCK[row][col] == ARR_BLOCK[row][col + 1]) {
                        ARR_BLOCK[row][col] += ARR_BLOCK[row][col + 1];
                        ARR_BLOCK[row][col + 1] = 0;
                        this._score += ARR_BLOCK[row][col];
                    }
                }
                ARR_BLOCK[row] = this.slideLeftOrUp(ARR_BLOCK[row]);
            }
            if(value === 39 || value === 0) {
                ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
                for(let col = 3; col > 0; col--) {
                    if(ARR_BLOCK[row][col] == ARR_BLOCK[row][col - 1]) {
                        ARR_BLOCK[row][col] += ARR_BLOCK[row][col - 1];
                        ARR_BLOCK[row][col - 1] = 0;
                        this._score += ARR_BLOCK[row][col];
                    }
                }
                ARR_BLOCK[row] = this.slideRightOrDown(ARR_BLOCK[row]);
            }
            this.hasChangeArray(arr, ARR_BLOCK[row]);
        }
        if(this._isChange) {
            this.addNum();
        }
    },
    
    checkUpDown(value) {
        for(let row = 0; row < GAME_CONFIG.ROW; row++) {
            let newArr = [];
            for(let col = 0; col < GAME_CONFIG.COL; col++) {
                newArr.push(ARR_BLOCK[col][row]);    
            }
            let arr  = newArr;
            if(value === 38 || value === 2) {
                newArr = this.slideLeftOrUp(newArr);
                for(let m = 0; m < 3; m++) {
                    if(newArr[m] == newArr[m + 1]) {
                        newArr[m] += newArr[m + 1];
                        newArr[m + 1] = 0;
                        this._score += newArr[m];
                    }
                }
                newArr = this.slideLeftOrUp(newArr);
            }
            if(value === 40 || value === 3) {
                newArr = this.slideRightOrDown(newArr);
                for(let m = 3; m > 0; m--) {
                    if(newArr[m] == newArr[m - 1]) {
                        newArr[m] += newArr[m - 1];
                        newArr[m - 1] = 0;
                        this._score += newArr[m];
                    }
                }
                newArr = this.slideRightOrDown(newArr);
            }
            for(let i = 0; i < 4; i++) {
                ARR_BLOCK[i][row] = newArr[i];
            }
            this.hasChangeArray(arr, newArr);
        }
        if(this._isChange) {
            this.addNum();
        }
    },

    getScoreStorge() {
        let scoreStorge = cc.sys.localStorage.getItem('bestScore');
        if (scoreStorge !== null) {
            this.record.string = JSON.parse(scoreStorge);
        } else {
            this.record.string = 0;
        }
    },

    checkScore() {
        let newScore = parseInt(this.score.string);
        if (newScore > this.record.string) {
            cc.sys.localStorage.setItem('bestScore', JSON.stringify(newScore));
            this.record.string = newScore;
        }
    },

    update() {
        this.checkWin();
        if(this.checkLose()) {
            this.loseGame.active = true;
            this.checkScore();
        };
    },
});
