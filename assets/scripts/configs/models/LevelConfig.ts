/**
 * 关卡中单张卡牌的位置配置。
 * 这里的坐标来自关卡配置文件，后续会通过工具类转换为 Cocos UI 坐标。
 */
export interface CardPositionConfig {
    /** 设计坐标系中的 x 坐标。 */
    x: number;

    /** 设计坐标系中的 y 坐标。 */
    y: number;
}

/**
 * 关卡中单张卡牌的静态配置。
 * CardFace 和 CardSuit 的数值需要与 CardFaceType、CardSuitType 枚举保持一致。
 */
export interface CardConfig {
    /** 卡牌点数，0=A，1=2，2=3，...，12=K。 */
    CardFace: number;

    /** 卡牌花色，0=梅花，1=方块，2=红桃，3=黑桃。 */
    CardSuit: number;

    /** 卡牌在关卡设计坐标系中的位置。 */
    Position: CardPositionConfig;
}

/**
 * 关卡配置数据。
 * Playfield 表示主牌区。
 * Stack 表示备用牌堆，后续生成 GameModel 时会从 Stack 中拆出初始 Tray 底牌。
 */
export interface LevelConfig {
    /** 主牌区卡牌配置。 */
    Playfield: CardConfig[];

    /** 备用牌堆配置。 */
    Stack: CardConfig[];
}