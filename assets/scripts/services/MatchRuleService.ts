import { CardFaceType } from '../models/CardEnums';
import { CardModel } from '../models/CardModel';

/**
 * 卡牌匹配规则服务。
 * 无状态服务，只根据传入的 CardModel 判断是否符合匹配规则。
 */
export class MatchRuleService {
    /**
     * 判断桌面牌是否可以和底牌顶部牌匹配。
     *
     * @param playfieldCard 被点击的桌面牌
     * @param trayTopCard 当前底牌顶部牌
     * @returns 是否可以匹配
     */
    public static canMatchWithTrayTop(
        playfieldCard: CardModel,
        trayTopCard: CardModel | null,
    ): boolean {
        if (!trayTopCard) {
            return false;
        }

        if (playfieldCard.isFaceDown || trayTopCard.isFaceDown) {
            return false;
        }

        if (!this.isValidFace(playfieldCard.face) || !this.isValidFace(trayTopCard.face)) {
            return false;
        }

        return Math.abs(playfieldCard.face - trayTopCard.face) === 1;
    }

    private static isValidFace(face: CardFaceType): boolean {
        return face > CardFaceType.None && face < CardFaceType.NumCardFaceTypes;
    }
}