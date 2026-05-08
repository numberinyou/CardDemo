import { Vec3 } from 'cc';
import { GameLayoutConst } from './GameLayoutConst';

/**
 * 坐标转换工具。
 * 用于将关卡配置中的设计坐标转换为 Cocos UI 本地坐标。
 */
export class PositionConvertUtil {
    /**
     * 将左下角为原点的设计坐标转换为 Canvas 中心为原点的 Cocos UI 坐标。
     *
     * @param x 关卡配置中的 x 坐标。
     * @param y 关卡配置中的 y 坐标。
     * @returns Cocos UI 本地坐标。
     */
    public static convertDesignPositionToCanvasPosition(x: number, y: number): Vec3 {
        return new Vec3(
            x - GameLayoutConst.DesignWidth / 2,
            y - GameLayoutConst.DesignHeight / 2,
            0,
        );
    }
}