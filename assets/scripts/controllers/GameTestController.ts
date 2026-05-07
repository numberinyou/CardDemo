import { _decorator, Component, Vec3 } from 'cc';
import { CardAreaType, CardFaceType, CardSuitType } from '../models/CardEnums';
import { CardModel } from '../models/CardModel';
import { GameModel } from '../models/GameModel';
import { GameView } from '../views/GameView';
import { MatchRuleService } from '../services/MatchRuleService';


const { ccclass, property } = _decorator;

@ccclass('GameTestController')
export class GameTestController extends Component {
    @property({
        type: GameView,
        tooltip: '游戏视图组件',
    })
    public gameView: GameView | null = null;

    private gameModel: GameModel | null = null;

    protected start(): void {
        this.gameModel = this.createTestGameModel();

        if (!this.gameView) {
            console.error('[GameTestController] gameView is missing.');
            return;
        }

        this.gameView.setCardClickCallback(this.handleCardClicked.bind(this));
        this.gameView.renderGame(this.gameModel);
    }

    private handleCardClicked(cardId: string): void {
        if (!this.gameModel) {
            console.error('[GameTestController] gameModel is missing.');
            return;
        }

        const cardModel = this.gameModel.getCardById(cardId);

        if (!cardModel) {
            console.warn(`[GameTestController] card not found: ${cardId}`);
            return;
        }

        console.log(`[GameTestController] clicked card: ${cardId}, area: ${this.getAreaName(cardModel.area)}`);

        switch (cardModel.area) {
            case CardAreaType.PlayField:
                this.handlePlayFieldCardClicked(cardModel);
                break;

            case CardAreaType.Stack:
                this.handleStackCardClicked(cardModel);
                break;

            case CardAreaType.Tray:
                console.log('[GameTestController] Tray card clicked, no action.');
                break;

            default:
                console.warn('[GameTestController] unknown card area.');
                break;
            }
    }

    private getAreaName(area: CardAreaType): string {
        switch (area) {
            case CardAreaType.PlayField:
                return 'PlayField';

            case CardAreaType.Stack:
                return 'Stack';

            case CardAreaType.Tray:
                return 'Tray';

            default:
                return 'Unknown';
        }
    }

    private createTestGameModel(): GameModel {
        const cards: CardModel[] = [
            new CardModel({
                id: 'tray_clubs_4',
                face: CardFaceType.Four,
                suit: CardSuitType.Clubs,
                area: CardAreaType.Tray,
                position: new Vec3(-120, -720, 0),
                isFaceDown: false,
            }),

            new CardModel({
                id: 'playfield_diamonds_3',
                face: CardFaceType.Three,
                suit: CardSuitType.Diamonds,
                area: CardAreaType.PlayField,
                position: new Vec3(-160, 220, 0),
                isFaceDown: false,
            }),

            new CardModel({
                id: 'playfield_spades_2',
                face: CardFaceType.Two,
                suit: CardSuitType.Spades,
                area: CardAreaType.PlayField,
                position: new Vec3(160, 220, 0),
                isFaceDown: false,
            }),

            new CardModel({
                id: 'stack_hearts_a',
                face: CardFaceType.A,
                suit: CardSuitType.Hearts,
                area: CardAreaType.Stack,
                position: new Vec3(120, -720, 0),
                isFaceDown: false,
            }),
        ];

        return new GameModel(cards);
    }

    private handlePlayFieldCardClicked(cardModel: CardModel): void {
    if (!this.gameModel) {
        return;
    }

    if (!this.gameView) {
        console.error('[GameTestController] gameView is missing.');
        return;
    }

    const trayTopCard = this.gameModel.getTrayTopCard();

    if (!trayTopCard) {
        console.warn('[GameTestController] tray top card is missing.');
        return;
    }

    const canMatch = MatchRuleService.canMatchWithTrayTop(cardModel, trayTopCard);

    if (!canMatch) {
        console.log(
            `[GameTestController] card cannot match tray top: ${cardModel.id} -> ${trayTopCard.id}`,
        );
        return;
    }

    const targetPosition = trayTopCard.position.clone();

    this.gameModel.moveCardToArea(cardModel.id, CardAreaType.Tray);
    this.gameModel.updateCardPosition(cardModel.id, targetPosition);

    this.gameView.moveCardToPosition(cardModel.id, targetPosition);

    console.log(
        `[GameTestController] matched card moved to tray: ${cardModel.id} -> ${trayTopCard.id}`,
        );
    }


    private handleStackCardClicked(cardModel: CardModel): void {
    if (!this.gameModel) {
        return;
    }

    if (!this.gameView) {
        console.error('[GameTestController] gameView is missing.');
        return;
    }

    const stackTopCard = this.gameModel.getStackTopCard();

    if (!stackTopCard) {
        console.warn('[GameTestController] stack top card is missing.');
        return;
    }

    if (stackTopCard.id !== cardModel.id) {
        console.log(
            `[GameTestController] clicked stack card is not top card: ${cardModel.id}`,
        );
        return;
    }

    const trayTopCard = this.gameModel.getTrayTopCard();

    if (!trayTopCard) {
        console.warn('[GameTestController] tray top card is missing.');
        return;
    }

    const targetPosition = trayTopCard.position.clone();

    this.gameModel.moveCardToArea(cardModel.id, CardAreaType.Tray);
    this.gameModel.updateCardPosition(cardModel.id, targetPosition);

    this.gameView.moveCardToPosition(cardModel.id, targetPosition);

    console.log(
        `[GameTestController] stack card moved to tray: ${cardModel.id} -> ${trayTopCard.id}`,
    );
    }

}