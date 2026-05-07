import { _decorator, Component, Sprite, SpriteFrame, Node, input, Input, EventTouch } from 'cc';

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

    private cardId: string = '';
    private clickCallback: ((cardId: string) => void) | null = null;

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public init(cardId: string, clickCallback: (cardId: string) => void): void {
        this.cardId = cardId;
        this.clickCallback = clickCallback;
    }

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

    public setBack(backFrame: SpriteFrame | null): void {
        if (this.backSprite) {
            this.backSprite.spriteFrame = backFrame;
        }
    }

    public setFaceDown(isFaceDown: boolean): void {
        this.setNodeActive(this.baseSprite?.node, !isFaceDown);
        this.setNodeActive(this.bigNumberSprite?.node, !isFaceDown);
        this.setNodeActive(this.smallNumberSprite?.node, !isFaceDown);
        this.setNodeActive(this.suitSprite?.node, !isFaceDown);
        this.setNodeActive(this.backSprite?.node, isFaceDown);
    }

    private onTouchEnd(event: EventTouch): void {
        event.propagationStopped = true;

        if (!this.cardId) {
            console.warn('[CardView] cardId is empty.');
            return;
        }

        if (!this.clickCallback) {
            console.warn('[CardView] clickCallback is missing.');
            return;
        }

        this.clickCallback(this.cardId);
    }

    private setNodeActive(node: Node | undefined, active: boolean): void {
        if (!node) {
            return;
        }

        node.active = active;
    }
}