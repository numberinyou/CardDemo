import { CardAreaType } from './CardEnums';
import { CardModel } from './CardModel';

export class GameModel {
    public cards: CardModel[] = [];

    public constructor(cards: CardModel[] = []) {
        this.cards = cards;
    }

    public getCardById(cardId: string): CardModel | null {
        return this.cards.find((card) => card.id === cardId) ?? null;
    }

    public getCardsByArea(area: CardAreaType): CardModel[] {
        return this.cards.filter((card) => card.area === area);
    }

    public getPlayFieldCards(): CardModel[] {
        return this.getCardsByArea(CardAreaType.PlayField);
    }

    public getStackCards(): CardModel[] {
        return this.getCardsByArea(CardAreaType.Stack);
    }

    public getTrayCards(): CardModel[] {
        return this.getCardsByArea(CardAreaType.Tray);
    }

    public getTrayTopCard(): CardModel | null {
        const trayCards = this.getTrayCards();

        if (trayCards.length === 0) {
            return null;
        }

        return trayCards[trayCards.length - 1];
    }

    public getStackTopCard(): CardModel | null {
        const stackCards = this.getStackCards();

        if (stackCards.length === 0) {
            return null;
        }

        return stackCards[stackCards.length - 1];
    }

    public moveCardToArea(cardId: string, targetArea: CardAreaType): boolean {
    const cardIndex = this.cards.findIndex((card) => card.id === cardId);

    if (cardIndex < 0) {
        return false;
    }

    const card = this.cards[cardIndex];
    card.area = targetArea;

    if (targetArea === CardAreaType.Tray) {
        this.cards.splice(cardIndex, 1);
        this.cards.push(card);
    }

    return true;
    }

    public updateCardPosition(cardId: string, position: Readonly<{ x: number; y: number; z: number }>): boolean {
        const card = this.getCardById(cardId);

        if (!card) {
            return false;
        }

        card.position.set(position.x, position.y, position.z);
        return true;
    }
}