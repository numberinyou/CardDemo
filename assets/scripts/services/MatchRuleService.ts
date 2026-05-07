import { CardModel } from '../models/CardModel';

export class MatchRuleService {
    public static canMatchWithTrayTop(playfieldCard: CardModel, trayTopCard: CardModel | null): boolean {
        if (!trayTopCard) {
            return false;
        }

        if (playfieldCard.isFaceDown) {
            return false;
        }

        if (trayTopCard.isFaceDown) {
            return false;
        }

        return Math.abs(playfieldCard.face - trayTopCard.face) === 1;
    }
}