import { _decorator, Component, Vec3, Node, Input } from 'cc';
import {
    CardAreaType,
    CardFaceType,
    CardSuitType,
    UndoOperationType,
} from '../models/CardEnums';
import { CardModel } from '../models/CardModel';
import { GameModel } from '../models/GameModel';
import { UndoModel } from '../models/UndoModel';
import { UndoManager } from '../managers/UndoManager';
import { LevelConfigLoader } from '../configs/loaders/LevelConfigLoader';
import { GameModelFromLevelGenerator } from '../services/GameModelFromLevelGenerator';
import { MatchRuleService } from '../services/MatchRuleService';
import { GameView } from '../views/GameView';

const { ccclass, property } = _decorator;

/**
 * 游戏测试控制器。
 *
 * 当前阶段负责：
 * 1. 加载关卡配置。
 * 2. 生成运行时 GameModel。
 * 3. 初始化 GameView。
 * 4. 处理卡牌点击、匹配移动、Stack 翻牌和 Undo 回退。
 *
 * 后续可以重命名为 GameController。
 */
@ccclass('GameTestController')
export class GameTestController extends Component {
    @property({
        tooltip: 'resources 目录下的关卡配置路径，不需要扩展名',
    })
    public levelConfigPath: string = 'configs/levels/level_001';

    @property({
        type: GameView,
        tooltip: '游戏视图组件',
    })
    public gameView: GameView | null = null;

    @property({
        type: Node,
        tooltip: '回退按钮节点',
    })
    public undoButtonNode: Node | null = null;

    private gameModel: GameModel | null = null;
    private undoManager: UndoManager = new UndoManager();

    protected start(): void {
        this.bindUndoButton();
        void this.startGame();
    }

    protected onDestroy(): void {
        if (this.undoButtonNode) {
            this.undoButtonNode.off(Input.EventType.TOUCH_END, this.handleUndoClicked, this);
        }
    }

    /**
     * 启动游戏。
     * 从关卡配置加载数据，生成 GameModel，并交给 GameView 渲染。
     */
    private async startGame(): Promise<void> {
        if (!this.gameView) {
            console.error('[GameTestController] gameView is missing.');
            return;
        }

        try {
            const levelConfig = await LevelConfigLoader.loadLevelConfig(this.levelConfigPath);

            this.gameModel = GameModelFromLevelGenerator.generate(levelConfig);
            this.undoManager.clear();

            this.gameView.setCardClickCallback(this.handleCardClicked.bind(this));
            this.gameView.renderGame(this.gameModel);

            console.log('[GameTestController] game started from level config.');
            console.log(`[GameTestController] all cards count: ${this.gameModel.cards.length}`);
            console.log(`[GameTestController] playfield count: ${this.gameModel.getPlayFieldCards().length}`);
            console.log(`[GameTestController] stack count: ${this.gameModel.getStackCards().length}`);
            console.log(`[GameTestController] tray count: ${this.gameModel.getTrayCards().length}`);
        } catch (error) {
            console.error('[GameTestController] start game failed:', error);
        }
    }

    /**
     * 绑定回退按钮。
     */
    private bindUndoButton(): void {
        if (!this.undoButtonNode) {
            console.warn('[GameTestController] undoButtonNode is missing.');
            return;
        }

        this.undoButtonNode.off(Input.EventType.TOUCH_END, this.handleUndoClicked, this);
        this.undoButtonNode.on(Input.EventType.TOUCH_END, this.handleUndoClicked, this);
    }

    /**
     * 处理卡牌点击事件。
     *
     * @param cardId 被点击的卡牌 id。
     */
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

        console.log(
            `[GameTestController] clicked card: ${cardId}, area: ${this.getAreaName(cardModel.area)}`,
        );

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

    /**
     * 处理主牌区卡牌点击。
     *
     * @param cardModel 被点击的主牌区卡牌。
     */
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

        this.recordMoveUndo(cardModel, CardAreaType.Tray, targetPosition);

        this.gameModel.moveCardToArea(cardModel.id, CardAreaType.Tray);
        this.gameModel.updateCardPosition(cardModel.id, targetPosition);

        this.gameView.moveCardToPosition(cardModel.id, targetPosition);

        console.log(
            `[GameTestController] matched card moved to tray: ${cardModel.id} -> ${trayTopCard.id}`,
        );
    }

    /**
     * 处理备用牌堆卡牌点击。
     *
     * 只有 Stack 顶部牌可以移动到 Tray。
     *
     * @param cardModel 被点击的 Stack 卡牌。
     */
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

        this.recordMoveUndo(cardModel, CardAreaType.Tray, targetPosition);

        this.gameModel.moveCardToArea(cardModel.id, CardAreaType.Tray);
        this.gameModel.updateCardPosition(cardModel.id, targetPosition);

        this.gameView.moveCardToPosition(cardModel.id, targetPosition);

        console.log(
            `[GameTestController] stack card moved to tray: ${cardModel.id} -> ${trayTopCard.id}`,
        );
    }

    /**
     * 记录卡牌移动回退数据。
     *
     * @param cardModel 即将移动的卡牌。
     * @param toArea 目标区域。
     * @param toPosition 目标位置。
     */
    private recordMoveUndo(cardModel: CardModel, toArea: CardAreaType, toPosition: Vec3): void {
        const undoRecord = new UndoModel({
            operationType: UndoOperationType.MoveCard,
            movedCardId: cardModel.id,
            fromArea: cardModel.area,
            toArea,
            fromPosition: cardModel.position.clone(),
            toPosition: toPosition.clone(),
        });

        this.undoManager.push(undoRecord);

        console.log(
            `[GameTestController] undo recorded: ${cardModel.id}, count: ${this.undoManager.getCount()}`,
        );
    }

    /**
     * 处理回退按钮点击。
     */
    private handleUndoClicked(): void {
        if (!this.gameModel) {
            console.error('[GameTestController] gameModel is missing.');
            return;
        }

        if (!this.gameView) {
            console.error('[GameTestController] gameView is missing.');
            return;
        }

        const undoRecord = this.undoManager.pop();

        if (!undoRecord) {
            console.log('[GameTestController] no undo record.');
            return;
        }

        if (undoRecord.operationType !== UndoOperationType.MoveCard) {
            console.warn('[GameTestController] unsupported undo operation.');
            return;
        }

        const cardModel = this.gameModel.getCardById(undoRecord.movedCardId);

        if (!cardModel) {
            console.warn(`[GameTestController] undo card not found: ${undoRecord.movedCardId}`);
            return;
        }

        cardModel.area = undoRecord.fromArea;
        cardModel.position = undoRecord.fromPosition.clone();

        this.gameView.moveCardToPosition(
            undoRecord.movedCardId,
            undoRecord.fromPosition.clone(),
        );

        console.log(
            `[GameTestController] undo move: ${undoRecord.movedCardId}, ${this.getAreaName(undoRecord.toArea)} -> ${this.getAreaName(undoRecord.fromArea)}`,
        );
    }

    /**
     * 获取区域名称，方便调试日志显示。
     *
     * @param area 卡牌区域枚举。
     * @returns 区域名称。
     */
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
}