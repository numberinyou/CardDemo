/**
 * 卡牌花色类型。
 * 与关卡配置中的 CardSuit 数值保持一致。
 */
export enum CardSuitType {
    None = -1,
    Clubs = 0,
    Diamonds = 1,
    Hearts = 2,
    Spades = 3,
    NumCardSuitTypes = 4,
}


/**
 * 卡牌点数类型。
 * 与关卡配置中的 CardFace 数值保持一致。
 */
export enum CardFaceType {
    None = -1,
    Ace = 0,
    Two = 1,
    Three = 2,
    Four = 3,
    Five = 4,
    Six = 5,
    Seven = 6,
    Eight = 7,
    Nine = 8,
    Ten = 9,
    Jack = 10,
    Queen = 11,
    King = 12,
    NumCardFaceTypes = 13,
}

/**
 * 卡牌所在区域。
 */
export enum CardAreaType {
    None = -1,
    PlayField = 0,
    Stack = 1,
    Tray = 2,
    NumCardAreaTypes = 3,
}



/**
 * 回退操作类型。
 * 当前只有移动卡牌，后续可以扩展翻牌、发牌、多牌移动等。
 */
export enum UndoOperationType {
    None = -1,
    MoveCard = 0,
    NumUndoOperationTypes = 1,
}