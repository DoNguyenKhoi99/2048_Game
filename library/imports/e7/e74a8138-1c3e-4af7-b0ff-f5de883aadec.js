"use strict";
cc._RF.push(module, 'e74a8E4HD5K97D/9d6IOq3s', 'BlockController');
// Scripts/BlockController.js

'use strict';

var COLOR = {
    0: cc.color('C0B4A4'),
    2: cc.color('E9DDD1'),
    4: cc.color('EAD9BE'),
    8: cc.color('F0E2A5'),
    16: cc.color('F28151'),
    32: cc.color('F26A4F'),
    64: cc.color('F2472E'),
    128: cc.color('E8C860'),
    256: cc.color('E9C34F'),
    512: cc.color('FF3300'),
    1024: cc.color('6666FF'),
    2048: cc.color('0033FF')
};

cc.Class({
    extends: cc.Component,

    properties: {
        Value: {
            default: null,
            type: cc.Label
        }
    },

    setColor: function setColor() {
        var number = parseInt(this.Value.string);
        this.node.color = COLOR[number];
    }
});

cc._RF.pop();