import { JsonAsset, resources } from 'cc';
import { LevelConfig } from '../models/LevelConfig';

/**
 * 关卡配置加载器。
 * 负责从 assets/resources 目录加载 JSON 关卡配置。
 */
export class LevelConfigLoader {
    /**
     * 加载关卡配置。
     *
     * @param resourcePath resources 下的资源路径，不需要写扩展名。
     * 例如：configs/levels/level_001
     * @returns LevelConfig 关卡配置对象。
     */
    public static loadLevelConfig(resourcePath: string): Promise<LevelConfig> {
        return new Promise((resolve, reject) => {
            resources.load(resourcePath, JsonAsset, (error, asset) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!asset) {
                    reject(new Error(`[LevelConfigLoader] asset is null: ${resourcePath}`));
                    return;
                }

                const levelConfig = asset.json as LevelConfig;

                if (!LevelConfigLoader.validateLevelConfig(levelConfig)) {
                    reject(new Error(`[LevelConfigLoader] invalid level config: ${resourcePath}`));
                    return;
                }

                resolve(levelConfig);
            });
        });
    }

    /**
     * 校验关卡配置是否具备基础字段。
     *
     * @param levelConfig 待校验的关卡配置。
     * @returns 是否是合法配置。
     */
    private static validateLevelConfig(levelConfig: LevelConfig | null | undefined): boolean {
        if (!levelConfig) {
            console.error('[LevelConfigLoader] levelConfig is empty.');
            return false;
        }

        if (!Array.isArray(levelConfig.Playfield)) {
            console.error('[LevelConfigLoader] Playfield should be an array.');
            return false;
        }

        if (!Array.isArray(levelConfig.Stack)) {
            console.error('[LevelConfigLoader] Stack should be an array.');
            return false;
        }

        if (levelConfig.Stack.length === 0) {
            console.error('[LevelConfigLoader] Stack should not be empty.');
            return false;
        }

        return true;
    }
}