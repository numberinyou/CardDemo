import { Vec3 } from 'cc';
import { LevelConfig, CardConfig } from '../configs/models/LevelConfig';
import { CardAreaType, CardFaceType, CardSuitType } from '../models/CardEnums';
import { CardModel } from '../models/CardModel';
import { GameModel } from '../models/GameModel';
import { GameLayoutConst } from '../utils/GameLayoutConst';
import { PositionConvertUtil } from '../utils/PositionConvertUtil';

/**
 * 关卡运行时数据生成服务。
 * 负责将静态 LevelConfig 转换为运行时 GameModel。
 *
 * 该服务不持有任何运行时数据，只接收配置并返回模型，
 * 符合 services 层“无状态、可复用”的职责边界。
 */
export class GameModelFromLevelGenerator {
    /**
     * 根据关卡配置生成游戏运行时模型。
     *
     * 规则：
     * 1. Playfield 配置全部生成 PlayField 卡牌。
     * 2. Stack 配置最后一张生成初始 Tray 底牌。
     * 3. Stack 剩余卡牌生成左侧备用牌堆。
     * 4. Stack 牌从底到顶叠放，顶部牌可点击。
     *
     * @param levelConfig 关卡静态配置。
     * @returns 运行时 GameModel。
     */
    public static generate(levelConfig: LevelConfig): GameModel {
        const cards: CardModel[] = [];

        cards.push(...this.createPlayFieldCards(levelConfig.Playfield));
        cards.push(...this.createStackCards(levelConfig.Stack));

        const trayCard = this.createInitialTrayCard(levelConfig.Stack);
        if (trayCard) {
            cards.push(trayCard);
        }

        return new GameModel(cards);
    }

    /**
     * 生成主牌区卡牌。
     *
     * @param playfieldConfigs 主牌区配置数组。
     * @returns 主牌区运行时卡牌数组。
     */
    private static createPlayFieldCards(playfieldConfigs: CardConfig[]): CardModel[] {
        return playfieldConfigs.map((cardConfig, index) => {
            const position = PositionConvertUtil.convertDesignPositionToCanvasPosition(
                cardConfig.Position.x,
                cardConfig.Position.y,
            );

            return new CardModel({
                id: `playfield_${index}`,
                face: this.toCardFaceType(cardConfig.CardFace),
                suit: this.toCardSuitType(cardConfig.CardSuit),
                area: CardAreaType.PlayField,
                position,
                isFaceDown: false,
            });
        });
    }

    /**
     * 生成备用牌堆卡牌。
     *
     * Stack 配置最后一张会被拆出去作为初始 Tray，
     * 剩余部分作为左侧 Stack。
     *
     * @param stackConfigs Stack 配置数组。
     * @returns Stack 运行时卡牌数组。
     */
    private static createStackCards(stackConfigs: CardConfig[]): CardModel[] {
        if (stackConfigs.length <= 1) {
            return [];
        }

        const stackOnlyConfigs = stackConfigs.slice(0, stackConfigs.length - 1);

        return stackOnlyConfigs.map((cardConfig, index) => {
            const position = this.getStackCardPosition(index, stackOnlyConfigs.length);

            return new CardModel({
                id: `stack_${index}`,
                face: this.toCardFaceType(cardConfig.CardFace),
                suit: this.toCardSuitType(cardConfig.CardSuit),
                area: CardAreaType.Stack,
                position,
                isFaceDown: false,
            });
        });
    }

    /**
     * 生成初始底牌。
     *
     * 当前约定：Stack 配置最后一张作为初始 Tray 顶部牌。
     *
     * @param stackConfigs Stack 配置数组。
     * @returns 初始 Tray 卡牌。
     */
    private static createInitialTrayCard(stackConfigs: CardConfig[]): CardModel | null {
        if (stackConfigs.length === 0) {
            return null;
        }

        const trayConfig = stackConfigs[stackConfigs.length - 1];

        return new CardModel({
            id: 'tray_initial',
            face: this.toCardFaceType(trayConfig.CardFace),
            suit: this.toCardSuitType(trayConfig.CardSuit),
            area: CardAreaType.Tray,
            position: GameLayoutConst.TrayBasePosition.clone(),
            isFaceDown: false,
        });
    }

    /**
     * 获取 Stack 卡牌位置。
     *
     * Stack 牌的数组顺序为从底到顶。
     * 最后一张 Stack 牌是当前可点击的顶部牌，放在 StackBasePosition。
     * 更底层的牌向上偏移，露出左上角 small 数字。
     *
     * @param index 当前 Stack 牌索引。
     * @param total Stack 总张数。
     * @returns Stack 牌位置。
     */
    private static getStackCardPosition(index: number, total: number): Vec3 {
        const offsetX = index * GameLayoutConst.StackVisibleOffsetX;
        const offsetY = index * GameLayoutConst.StackVisibleOffsetY;

        return new Vec3(
            GameLayoutConst.StackBasePosition.x + offsetX,
            GameLayoutConst.StackBasePosition.y + offsetY,
            GameLayoutConst.StackBasePosition.z,
        );
    }

    /**
     * 将配置中的 CardFace 数字转换成 CardFaceType。
     *
     * @param value 配置中的点数值。
     * @returns CardFaceType。
     */
    private static toCardFaceType(value: number): CardFaceType {
        if (value < CardFaceType.Ace || value >= CardFaceType.NumCardFaceTypes) {
            console.warn(`[GameModelFromLevelGenerator] invalid CardFace: ${value}`);
            return CardFaceType.None;
        }

        return value as CardFaceType;
    }

    /**
     * 将配置中的 CardSuit 数字转换成 CardSuitType。
     *
     * @param value 配置中的花色值。
     * @returns CardSuitType。
     */
    private static toCardSuitType(value: number): CardSuitType {
        if (value < CardSuitType.Clubs || value >= CardSuitType.NumCardSuitTypes) {
            console.warn(`[GameModelFromLevelGenerator] invalid CardSuit: ${value}`);
            return CardSuitType.None;
        }

        return value as CardSuitType;
    }
}