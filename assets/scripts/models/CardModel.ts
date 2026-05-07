import { Vec3 } from 'cc';
import { CardAreaType, CardFaceType, CardSuitType } from './CardEnums';

export class CardModel {
    public id: string;
    public face: CardFaceType;
    public suit: CardSuitType;
    public area: CardAreaType;
    public position: Vec3;
    public isFaceDown: boolean;

    public constructor(params: {
        id: string;
        face: CardFaceType;
        suit: CardSuitType;
        area: CardAreaType;
        position: Vec3;
        isFaceDown?: boolean;
    }) {
        this.id = params.id;
        this.face = params.face;
        this.suit = params.suit;
        this.area = params.area;
        this.position = params.position;
        this.isFaceDown = params.isFaceDown ?? false;
    }

    public clone(): CardModel {
        return new CardModel({
            id: this.id,
            face: this.face,
            suit: this.suit,
            area: this.area,
            position: this.position.clone(),
            isFaceDown: this.isFaceDown,
        });
    }

    public isRedSuit(): boolean {
        return this.suit === CardSuitType.Diamonds || this.suit === CardSuitType.Hearts;
    }
}