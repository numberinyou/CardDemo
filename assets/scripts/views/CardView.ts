import { _decorator, Component, Sprite, SpriteFrame, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CardView')
export class CardView extends Component {
    @property({
        type: Sprite,
        tooltip: '卡牌正面底图 Sprite',
    })
    public baseSprite: Sprite | null = null;

    @property({
        type: Sprite,
        tooltip: '卡牌中间大数字 Sprite',
    })
    public bigNumberSprite: Sprite | null = null;

    @property({
        type: Sprite,
        tooltip: '卡牌左上角小数字 Sprite',
    })
    public smallNumberSprite: Sprite | null = null;

    @property({
        type: Sprite,
        tooltip: '卡牌花色 Sprite',
    })
    public suitSprite: Sprite | null = null;

    @property({
        type: Sprite,
        tooltip: '卡牌背面 Sprite',
    })
    public backSprite: Sprite | null = null;

    /**
     * 设置卡牌正面资源。
     */
    public setFront(
        baseFrame: SpriteFrame | null,
        bigNumberFrame: SpriteFrame | null,
        smallNumberFrame: SpriteFrame | null,
        suitFrame: SpriteFrame | null,
    ): void {
        if (this.baseSprite) {
            this.baseSprite.spriteFrame = baseFrame;
        }

        if (this.bigNumberSprite) {
            this.bigNumberSprite.spriteFrame = bigNumberFrame;
        }

        if (this.smallNumberSprite) {
            this.smallNumberSprite.spriteFrame = smallNumberFrame;
        }

        if (this.suitSprite) {
            this.suitSprite.spriteFrame = suitFrame;
        }
    }

    /**
     * 设置卡牌背面资源。
     */
    public setBack(backFrame: SpriteFrame | null): void {
        if (this.backSprite) {
            this.backSprite.spriteFrame = backFrame;
        }
    }

    /**
     * 设置是否显示背面。
     */
    public setFaceDown(isFaceDown: boolean): void {
        this.setNodeActive(this.baseSprite?.node, !isFaceDown);
        this.setNodeActive(this.bigNumberSprite?.node, !isFaceDown);
        this.setNodeActive(this.smallNumberSprite?.node, !isFaceDown);
        this.setNodeActive(this.suitSprite?.node, !isFaceDown);
        this.setNodeActive(this.backSprite?.node, isFaceDown);
    }

    private setNodeActive(node: Node | undefined, active: boolean): void {
        if (!node) {
            return;
        }

        node.active = active;
    }
}