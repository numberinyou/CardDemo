import { Vec3 } from 'cc';

/**
 * 游戏布局常量。
 * 统一管理设计分辨率、牌堆位置、Stack 叠牌偏移等固定布局数据。
 */
export class GameLayoutConst {
    /** 设计分辨率宽度。 */
    public static readonly DesignWidth = 1080;

    /** 设计分辨率高度。 */
    public static readonly DesignHeight = 2080;

    /**
     * Stack 最底层牌的基础位置。
     * 需求要求 Stack 在左侧。
     */
    public static readonly StackBasePosition = new Vec3(-320, -760, 0);

    /**
     * Tray 底牌堆基础位置。
     * 需求要求底牌在右侧。
     */
    public static readonly TrayBasePosition = new Vec3(260, -760, 0);

    /**
     * Stack 叠牌时，每向上一层向右偏移的距离。
     * 这里先按大约半张牌宽处理，方便露出下方牌的大半或半个牌面。
     */
    public static readonly StackVisibleOffsetX = 90;

    /**
     * Stack 叠牌时的纵向偏移。
     * 当前需求主要是向右展开，所以这里先保持 0。
     * 如果后面想做一点斜向层叠，可以改成 6、8 之类的小值。
     */
    public static readonly StackVisibleOffsetY = 0;
}