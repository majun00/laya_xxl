const data = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

class LLK {

    area = [];
    boxs = [];
    select = null;
    scoreSprite = null;
    score = 0;
    constructor(scoreSprite?: any) {
        this.scoreSprite = scoreSprite;

        this.init();
        this.createTexts();
    }

    /**
     * 初始化方格
     */
    init() {
        let sprite = null;
        let box = null;
        for (let i = 0; i < COUNT_ROW; i++) {
            let rowArea = [];
            let boxArea = [];
            for (let j = 0; j < COUNT_COLUMN; j++) {
                sprite = new Laya.Sprite();
                sprite.graphics.drawRect(0, 0, WIDTH_BLOCK, HEIGHT_BLOCK, null, '#ffffff', 1);
                sprite.size(WIDTH_BLOCK, HEIGHT_BLOCK);
                sprite.pos(i * WIDTH_BLOCK, j * HEIGHT_BLOCK);
                sprite.mouseEnabled = true;
                sprite.on(Laya.Event.MOUSE_DOWN, this, (e) => { this.handleClickBlock(e, i, j) });
                rowArea.push(sprite);
                Laya.stage.addChild(sprite);

                box = new laya.display.Text();
                box.fontSize = FONT_SIZE;
                box.color = '#000000'
                box.pos((WIDTH_BLOCK - FONT_SIZE) / 2 + i * WIDTH_BLOCK, (HEIGHT_BLOCK - FONT_SIZE) / 2 + j * HEIGHT_BLOCK);
                Laya.stage.addChild(box);
                boxArea.push(box);
            }
            this.area.push(rowArea);
            this.boxs.push(boxArea);
        }
    }

    /**
     * 初始化方格数据
     */
    createTexts() {
        let index = 0;

        for (let i = 0; i < COUNT_ROW; i++) {
            for (let j = 0; j < COUNT_COLUMN; j++) {
                this.boxs[i][j].text = this.createSingleText(i, j);
            }
        }
    }

    /**
     * 生成某个区域的数据
     * @param i 横向索引
     * @param j 纵向索引
     */
    createSingleText(i, j) {
        let index = Math.floor(data.length * Math.random());
        let res = this.checkSimple(i, j, data[index]);
        if (res.row.length >= 3 || res.column.length >= 3) {
            return this.createSingleText(i, j);
        } else {
            return data[index];
        }
    }

    /**
     * 检索点(x, y)周围的相同的数据
     * @param x {number} 横向坐标
     * @param y {number} 纵向坐标
     * @param content {String} 可选字段，某点的内容 
     */
    checkSimple(x, y, content?: any) {
        let res = {
            row: [],
            column: []
        };
        content = content ? content : this.boxs[x][y].text;
        if (!content) {
            return res;
        }
        // 1. 判断横向相同
        // 1.1 向左
        for (let i = x; i >= 0; i--) {
            if (this.boxs[i][y].text === content) {
                res.row.push({ i: i, j: y });
            } else {
                // 有一个不相同就break;
                break;
            }
        }
        // 1.2 向右
        for (let i = x + 1; i < COUNT_COLUMN; i++) {
            if (this.boxs[i][y].text === content) {
                res.row.push({ i: i, j: y });
            } else {
                // 有一个不相同就break;
                break;
            }
        }

        // 2. 判断纵向相同
        // 2.1 向上判断
        for (let j = y; j >= 0; j--) {
            if (this.boxs[x][j].text === content) {
                res.column.push({ i: x, j: j });
            } else {
                // 有一个不相同就break;
                break;
            }
        }
        for (let j = y + 1; j < COUNT_COLUMN; j++) {
            if (this.boxs[x][j].text === content) {
                res.column.push({ i: x, j: j });
            } else {
                // 有一个不相同就break;
                break;
            }
        }
        return res;
    }

    /**
     * 点击某点的事件处理函数
     * @param e 事件对象
     * @param i 横向坐标索引
     * @param j 纵向坐标索引
     */
    handleClickBlock(e, i, j) {
        if (!this.select) {
            this.select = { i: i, j: j };
            this.boxs[i][j].color = '#ff0000';
        } else if (i === this.select.i && j === this.select.j) {
            // 是同一块;
            this.select = null;
            this.boxs[i][j].color = '#000000';
        } else {
            // 把之前的变成黑色字体
            this.boxs[this.select.i][this.select.j].color = '#000000';

            // 处理相邻的两个元素
            if ((Math.abs(i - this.select.i) === 1 && j === this.select.j)
                || Math.abs(j - this.select.j) === 1 && i === this.select.i) {
                // 相邻判断能否消除
                let flag: boolean = this.handleReDraw(this.select, { i: i, j: j });
                if (flag) {
                    this.select = null;
                } else {
                    this.select = { i: i, j: j };
                    this.boxs[i][j].color = '#ff0000';
                }
            } else {
                this.select = { i: i, j: j };
                this.boxs[i][j].color = '#ff0000';
            }
        }
    }

    /**
     * 根据点击的两点，重绘周围需要消除的点
     * @param start 初始点 {i: i, j: j}
     * @param end 结束点 {i: i, j: j}
     */
    handleReDraw(start, end) {
        let startBeginText = this.boxs[start.i][start.j].text;
        let endBeginText = this.boxs[end.i][end.j].text;
        // 先临时将相邻的两个交换
        this.boxs[start.i][start.j].text = endBeginText;
        this.boxs[end.i][end.j].text = startBeginText;

        let startRes = this.checkSimple(start.i, start.j);
        let endRes = this.checkSimple(end.i, end.j);

        let needToReCreate = [];
        if (startRes.row.length >= 3) {
            needToReCreate = needToReCreate.concat(startRes.row);
        }
        if (startRes.column.length >= 3) {
            needToReCreate = needToReCreate.concat(startRes.column);
        }
        if (endRes.row.length >= 3) {
            needToReCreate = needToReCreate.concat(endRes.row);
        }
        if (endRes.column.length >= 3) {
            needToReCreate = needToReCreate.concat(endRes.column);
        }
        if (needToReCreate.length >= 3) {
            // 先将之前的内容全部清空
            for (let i = 0; i < needToReCreate.length; i++) {
                let item = needToReCreate[i];
                this.boxs[item.i][item.j].text = '';
            }

            // 在重新生成数据
            for (let i = 0; i < needToReCreate.length; i++) {
                let item = needToReCreate[i];
                this.boxs[item.i][item.j].text = this.createSingleText(item.i, item.j);
            }
            this.calScore(needToReCreate.length);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 更新分数值
     * @param score 本次操作的得分
     */
    calScore(score) {
        this.score += score;
        this.scoreSprite.text = '得分：' + this.score;
    }
}