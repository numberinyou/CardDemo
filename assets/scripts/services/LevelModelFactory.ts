import { Vec3 } from 'cc';
import { LevelCardConfig, LevelCardFace, LevelCardSuit, LevelConfig } from '../configs/LevelConfig';
import { CardAreaType, CardFaceType, CardSuitType } from '../models/CardEnums';
import { CardModel } from '../models/CardModel';
import { GameModel } from '../models/GameModel';

export class LevelModelFactory {
    public static createGameModel(levelConfig: LevelConfig): GameModel {
        const cards: CardModel[] = [];

        cards.push(
            ...this.createCardsByArea(
                levelConfig.tray,
                CardAreaType.Tray,
                'tray',
            ),
        );

        cards.push(
            ...this.createCardsByArea(
                levelConfig.playField,
                CardAreaType.PlayField,
                'playfield',
            ),
        );

        cards.push(
            ...this.createCardsByArea(
                levelConfig.stack,
                CardAreaType.Stack,
                'stack',
            ),
        );

        return new GameModel(cards);
    }

    private static createCardsByArea(
        cardConfigs: LevelCardConfig[],
        area: CardAreaType,
        areaPrefix: string,
    ): CardModel[] {
        return cardConfigs.map((cardConfig, index) => {
            const face = this.convertFace(cardConfig.face);
            const suit = this.convertSuit(cardConfig.suit);
            const id = this.createCardId(areaPrefix, cardConfig, index);

            return new CardModel({
                id,
                face,
                suit,
                area,
                position: new Vec3(cardConfig.x, cardConfig.y, 0),
                isFaceDown: cardConfig.isFaceDown ?? false,
            });
        });
    }

    private static convertFace(face: LevelCardFace): CardFaceType {
        switch (face) {
            case 'A':
                return CardFaceType.A;

            case 'Two':
                return CardFaceType.Two;

            case 'Three':
                return CardFaceType.Three;

            case 'Four':
                return CardFaceType.Four;

            case 'Five':
                return CardFaceType.Five;

            case 'Six':
                return CardFaceType.Six;

            case 'Seven':
                return CardFaceType.Seven;

            case 'Eight':
                return CardFaceType.Eight;

            case 'Nine':
                return CardFaceType.Nine;

            case 'Ten':
                return CardFaceType.Ten;

            case 'J':
                return CardFaceType.J;

            case 'Q':
                return CardFaceType.Q;

            case 'K':
                return CardFaceType.K;

            default:
                throw new Error(`[LevelModelFactory] unsupported card face: ${face}`);
        }
    }

    private static convertSuit(suit: LevelCardSuit): CardSuitType {
        switch (suit) {
            case 'Clubs':
                return CardSuitType.Clubs;

            case 'Diamonds':
                return CardSuitType.Diamonds;

            case 'Hearts':
                return CardSuitType.Hearts;

            case 'Spades':
                return CardSuitType.Spades;

            default:
                throw new Error(`[LevelModelFactory] unsupported card suit: ${suit}`);
        }
    }

    private static createCardId(
        areaPrefix: string,
        cardConfig: LevelCardConfig,
        index: number,
    ): string {
        return `${areaPrefix}_${cardConfig.suit.toLowerCase()}_${cardConfig.face.toLowerCase()}_${index}`;
    }
}