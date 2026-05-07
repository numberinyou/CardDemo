import { _decorator, Component, Vec3 } from 'cc';
import { CardAreaType, CardFaceType, CardSuitType } from '../models/CardEnums';
import { CardModel } from '../models/CardModel';
import { GameModel } from '../models/GameModel';
import { GameView } from '../views/GameView';

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

        this.gameView.renderGame(this.gameModel);
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
}