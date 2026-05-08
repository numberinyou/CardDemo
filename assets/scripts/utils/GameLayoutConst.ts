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
     * Stack 备用牌堆基础位置。
     * 需求要求 Stack 在左侧。
     */
    public static readonly StackBasePosition = new Vec3(-260, -760, 0);

    /**
     * Tray 底牌堆基础位置。
     * 需求要求底牌在右侧。
     */
    public static readonly TrayBasePosition = new Vec3(260, -760, 0);

    /**
     * Stack 叠牌时，每张牌向上露出的距离。
     * 这样下一张牌的左上角 small 数字可以露出来。
     */
    public static readonly StackVisibleOffsetY = 42;
}