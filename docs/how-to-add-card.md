# 新增卡牌与新增关卡配置说明

## 1. 新增一张卡牌的两种含义

项目中“新增卡牌”可能有两种含义：

```text
1. 新增一种卡牌资源，例如新增新的牌面美术。
2. 在关卡中新增一张牌，例如在 Playfield 或 Stack 中多配置一张牌。
```

当前 Demo 的标准牌面已经覆盖：

```text
A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
梅花、方块、红桃、黑桃
```

所以大部分情况下，只需要在关卡 JSON 中新增卡牌配置。

## 2. 在关卡中新增 Playfield 卡牌

关卡文件位置：

```text
assets/resources/configs/levels/level_001.json
```

在 `Playfield` 数组中新增一项：

```json
{
    "CardFace": 2,
    "CardSuit": 1,
    "Position": { "x": 350, "y": 600 }
}
```

字段说明：

```text
CardFace:
    0 = A
    1 = 2
    2 = 3
    ...
    12 = K

CardSuit:
    0 = Clubs    梅花
    1 = Diamonds 方块
    2 = Hearts   红桃
    3 = Spades   黑桃

Position:
    设计坐标系中的位置
```

新增后，运行时流程：

```text
LevelConfigLoader 读取 JSON
↓
GameModelFromLevelGenerator 创建 CardModel
↓
GameView 渲染卡牌
```

不需要改 View 或 Controller。

## 3. 在 Stack 中新增备用牌

在 `Stack` 数组中新增卡牌。

注意当前约定：

```text
Stack 数组最后一张会作为初始 Tray 底牌
Stack 数组前面的牌作为左侧备用牌堆
Stack 中最后一个剩余元素是当前可点击的顶部牌
```

例如：

```json
"Stack": [
    {
        "CardFace": 2,
        "CardSuit": 0,
        "Position": { "x": 0, "y": 0 }
    },
    {
        "CardFace": 0,
        "CardSuit": 2,
        "Position": { "x": 0, "y": 0 }
    },
    {
        "CardFace": 3,
        "CardSuit": 0,
        "Position": { "x": 0, "y": 0 }
    }
]
```

解释：

```text
Stack[0] -> 左侧备用牌堆底层
Stack[1] -> 左侧备用牌堆顶部
Stack[2] -> 初始 Tray 底牌
```

如果想让更多备用牌可抽，就在最后一张初始底牌前面继续增加卡牌。

## 4. 新增卡牌资源

如果需要替换或扩展卡牌图片资源，需要修改：

```text
CardResConfigNode
```

对应脚本：

```text
assets/scripts/configs/CardResConfig.ts
```

当前资源字段：

```text
cardGeneral
cardBack
blackBigNumberFrames
redBigNumberFrames
blackSmallNumberFrames
redSmallNumberFrames
suitFrames
```

数字数组顺序必须是：

```text
A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
```

花色数组顺序必须是：

```text
Clubs, Diamonds, Hearts, Spades
```

原因是：

```text
CardFaceType.Ace = 0
CardFaceType.Two = 1
...
CardFaceType.King = 12

CardSuitType.Clubs = 0
CardSuitType.Diamonds = 1
CardSuitType.Hearts = 2
CardSuitType.Spades = 3
```

代码会直接用枚举值作为数组下标。

## 5. 新增一种特殊牌

如果后续新增特殊牌，例如万能牌、障碍牌、锁定牌，不建议直接改 CardView。

推荐步骤：

### 5.1 扩展 CardModel

例如新增字段：

```text
cardSpecialType
```

或：

```text
isWildCard
isLocked
```

### 5.2 扩展关卡配置

在 `CardConfig` 中新增字段：

```text
SpecialType
```

### 5.3 扩展 GameModelFromLevelGenerator

读取新配置字段并写入 CardModel。

### 5.4 扩展规则服务

如果特殊牌影响匹配规则，应改：

```text
MatchRuleService
```

例如：

```text
万能牌可以匹配任意 Tray 顶部牌
锁定牌不能点击
```

### 5.5 扩展视图表现

如果特殊牌需要特殊图标或遮罩，再改：

```text
CardView
GameView
CardResConfig
```
