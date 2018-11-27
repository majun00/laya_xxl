
// 程序入口
class GameMain {
    constructor() {
        //TS或JS版本初始化微信小游戏的适配
        Laya.MiniAdpter.init();
        Laya.init(CONTAINER_WIDTH, CONTAINER_HEIGHT);

        // 设置背景图片
        let background = new Laya.Sprite();
        background.loadImage("res/linkgame_back.jpg", 0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT);
        background.cacheAsBitmap = true;
        Laya.stage.addChild(background);

        let scoreSprite = new laya.display.Text();
        scoreSprite.size(20, 20);
        scoreSprite.pos(0, BG_HEIGHT + (CONTAINER_HEIGHT - BG_HEIGHT - 20) / 2);
        scoreSprite.text = '得分：';
        Laya.stage.addChild(scoreSprite);

        let llk = new LLK(scoreSprite);
    }
}
new GameMain();