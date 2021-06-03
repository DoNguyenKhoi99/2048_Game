
const COLOR = {
    0: cc.color('C0B4A4'),
    2: cc.color('E9DDD1'),
    4: cc.color('EAD9BE'),
    8: cc.color('EAD9BE'),
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
        Value :{
            default : null,
            type : cc.Label,
        },
    },

    setColor(){
        let number = parseInt(this.Value.string);
            this.node.color = COLOR[number];
    }
});
