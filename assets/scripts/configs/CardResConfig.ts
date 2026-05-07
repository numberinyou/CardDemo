import { _decorator, Component, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CardResConfig')
export class CardResConfig extends Component {
    @property({
        type: SpriteFrame,
        tooltip: '卡牌正面通用底图',
    })
    public cardGeneral: SpriteFrame | null = null;

    @property({
        type: SpriteFrame,
        tooltip: '卡牌背面图',
    })
    public cardBack: SpriteFrame | null = null;

    @property({
        type: [SpriteFrame],
        tooltip: '黑色大数字帧，顺序必须是 A,2,3,4,5,6,7,8,9,10,J,Q,K',
    })
    public blackBigNumberFrames: SpriteFrame[] = [];

    @property({
        type: [SpriteFrame],
        tooltip: '红色大数字帧，顺序必须是 A,2,3,4,5,6,7,8,9,10,J,Q,K',
    })
    public redBigNumberFrames: SpriteFrame[] = [];

    @property({
        type: [SpriteFrame],
        tooltip: '黑色小数字帧，顺序必须是 A,2,3,4,5,6,7,8,9,10,J,Q,K',
    })
    public blackSmallNumberFrames: SpriteFrame[] = [];

    @property({
        type: [SpriteFrame],
        tooltip: '红色小数字帧，顺序必须是 A,2,3,4,5,6,7,8,9,10,J,Q,K',
    })
    public redSmallNumberFrames: SpriteFrame[] = [];

    @property({
        type: [SpriteFrame],
        tooltip: '花色帧，顺序必须是 clubs, diamonds, hearts, spades',
    })
    public suitFrames: SpriteFrame[] = [];

    public getBigNumberFrame(faceIndex: number, isRed: boolean): SpriteFrame | null {
        const frames = isRed ? this.redBigNumberFrames : this.blackBigNumberFrames;
        return frames[faceIndex] ?? null;
    }

    public getSmallNumberFrame(faceIndex: number, isRed: boolean): SpriteFrame | null {
        const frames = isRed ? this.redSmallNumberFrames : this.blackSmallNumberFrames;
        return frames[faceIndex] ?? null;
    }

    public getSuitFrame(suitIndex: number): SpriteFrame | null {
        return this.suitFrames[suitIndex] ?? null;
    }

    public validateConfig(): boolean {
        let isValid = true;

        if (!this.cardGeneral) {
            console.warn('[CardResConfig] cardGeneral is missing.');
            isValid = false;
        }

        if (!this.cardBack) {
            console.warn('[CardResConfig] cardBack is missing.');
            isValid = false;
        }

        if (this.blackBigNumberFrames.length !== 13) {
            console.warn('[CardResConfig] blackBigNumberFrames length should be 13.');
            isValid = false;
        }

        if (this.redBigNumberFrames.length !== 13) {
            console.warn('[CardResConfig] redBigNumberFrames length should be 13.');
            isValid = false;
        }

        if (this.blackSmallNumberFrames.length !== 13) {
            console.warn('[CardResConfig] blackSmallNumberFrames length should be 13.');
            isValid = false;
        }

        if (this.redSmallNumberFrames.length !== 13) {
            console.warn('[CardResConfig] redSmallNumberFrames length should be 13.');
            isValid = false;
        }

        if (this.suitFrames.length !== 4) {
            console.warn('[CardResConfig] suitFrames length should be 4.');
            isValid = false;
        }

        return isValid;
    }
}