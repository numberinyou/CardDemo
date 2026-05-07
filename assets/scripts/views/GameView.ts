import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { CardResConfig } from '../configs/CardResConfig';
import { CardAreaType } from '../models/CardEnums';
import { CardModel } from '../models/CardModel';
import { GameModel } from '../models/GameModel';
import { CardView } from './CardView';

const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({
        type: Node,
        tooltip: '卡牌父节点，所有动态生成的卡牌都会挂到这里',
    })
    public cardLayer: Node | null = null;

    @property({
        type: Prefab,
        tooltip: '卡牌 prefab',
    })
    public cardViewPrefab: Prefab | null = null;

    @property({
        type: CardResConfig,
        tooltip: '卡牌资源配置',
    })
    public cardResConfig: CardResConfig | null = null;

    private cardViewMap: Map<string, CardView> = new Map();

    public renderGame(gameModel: GameModel): void {
        this.clearCards();

        if (!this.cardLayer) {
            console.error('[GameView] cardLayer is missing.');
            return;
        }

        if (!this.cardViewPrefab) {
            console.error('[GameView] cardViewPrefab is missing.');
            return;
        }

        if (!this.cardResConfig) {
            console.error('[GameView] cardResConfig is missing.');
            return;
        }

        this.cardResConfig.validateConfig();

        for (const cardModel of gameModel.cards) {
            this.createCardView(cardModel);
        }
    }

    private clearCards(): void {
        if (!this.cardLayer) {
            return;
        }

        this.cardLayer.removeAllChildren();
        this.cardViewMap.clear();
    }

    private createCardView(cardModel: CardModel): void {
        if (!this.cardLayer || !this.cardViewPrefab || !this.cardResConfig) {
            return;
        }

        const cardNode = instantiate(this.cardViewPrefab);
        cardNode.name = `Card_${cardModel.id}`;
        cardNode.setPosition(cardModel.position);
        cardNode.setParent(this.cardLayer);

        const cardView = cardNode.getComponent(CardView);

        if (!cardView) {
            console.error('[GameView] CardView component is missing on card prefab.');
            return;
        }

        this.applyCardDisplay(cardView, cardModel);
        this.cardViewMap.set(cardModel.id, cardView);
    }

    private applyCardDisplay(cardView: CardView, cardModel: CardModel): void {
        if (!this.cardResConfig) {
            return;
        }

        const isRed = cardModel.isRedSuit();

        const bigNumberFrame = this.cardResConfig.getBigNumberFrame(cardModel.face, isRed);
        const smallNumberFrame = this.cardResConfig.getSmallNumberFrame(cardModel.face, isRed);
        const suitFrame = this.cardResConfig.getSuitFrame(cardModel.suit);

        cardView.setFront(
            this.cardResConfig.cardGeneral,
            bigNumberFrame,
            smallNumberFrame,
            suitFrame,
        );

        cardView.setBack(this.cardResConfig.cardBack);
        cardView.setFaceDown(cardModel.isFaceDown);
    }

    public getCardView(cardId: string): CardView | null {
        return this.cardViewMap.get(cardId) ?? null;
    }
}