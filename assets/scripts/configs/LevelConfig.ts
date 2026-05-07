export type LevelCardFace =
    | 'A'
    | 'Two'
    | 'Three'
    | 'Four'
    | 'Five'
    | 'Six'
    | 'Seven'
    | 'Eight'
    | 'Nine'
    | 'Ten'
    | 'J'
    | 'Q'
    | 'K';

export type LevelCardSuit =
    | 'Clubs'
    | 'Diamonds'
    | 'Hearts'
    | 'Spades';

export interface LevelCardConfig {
    face: LevelCardFace;
    suit: LevelCardSuit;
    x: number;
    y: number;
    isFaceDown?: boolean;
}

export interface LevelConfig {
    levelId: string;
    tray: LevelCardConfig[];
    playField: LevelCardConfig[];
    stack: LevelCardConfig[];
}